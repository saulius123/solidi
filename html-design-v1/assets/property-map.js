const params = new URLSearchParams(location.search);
const latitude = Number(params.get('lat'));
const longitude = Number(params.get('lon'));
if (!params.has('lat') || !params.has('lon') || !Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude)>90 || Math.abs(longitude)>180 || typeof L==='undefined') {
  document.querySelector('#map').textContent='Žemėlapis nepasiekiamas. Naudokite nuorodą objekto puslapyje.';
} else {
  document.querySelector('#map').replaceChildren();
  const map = L.map('map', {scrollWheelZoom:false,zoomControl:false}).setView([latitude,longitude],13);
  L.control.zoom({position:'topright',zoomInTitle:'Priartinti',zoomOutTitle:'Atitolinti'}).addTo(map);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap autoriai</a>'}).addTo(map);
  const icon=L.divIcon({className:'house-marker',iconSize:[48,58],iconAnchor:[24,56],popupAnchor:[0,-49],html:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 58" aria-hidden="true"><path d="M24 2 45 20v24H31l-7 12-7-12H3V20Z" fill="#30332f" stroke="#f8f6f2" stroke-width="2.5" stroke-linejoin="round"/><path d="m13 25 11-9 11 9M16 24v13h16V24M21 37V27h6v10" fill="none" stroke="#f8f6f2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'});
  L.marker([latitude,longitude],{icon,title:'Pavyzdinė objekto vieta',alt:'Tamsus namo formos vietos žymeklis'}).addTo(map).bindPopup('Pavyzdinė objekto vieta. Tikslus adresas nepatvirtintas.');
  const categories = {
    schools:{label:'Mokyklos',fallback:'Mokykla',color:'#596b83',path:'M8 13h16v13H8z M6 13l10-6 10 6 M13 26v-7h6v7 M11 16h1m8 0h1'},
    shops:{label:'Parduotuvės',fallback:'Parduotuvė',color:'#94634e',path:'M8 12h16l2 14H6z M12 12V9a4 4 0 0 1 8 0v3'},
    sports:{label:'Sporto klubai',fallback:'Sporto klubas',color:'#65745a',path:'M11 16h10 M7 11v10 M11 9v14 M21 9v14 M25 11v10 M7 16h4m10 0h4'}
  };
  const selected = new Set();
  const layers = Object.fromEntries(Object.keys(categories).map(key=>[key,L.layerGroup()]));
  const status = document.querySelector('#nearby-status');
  const retry = document.querySelector('#nearby-retry');
  let loaded=false, pending=null, failed=false;
  function update(){
    for(const key of Object.keys(categories)){
      if(selected.has(key))layers[key].addTo(map);else map.removeLayer(layers[key]);
    }
    retry.hidden=!failed||selected.size===0;
    if(!selected.size)status.textContent='Pasirinkite kategorijas · 2 km spinduliu';
    else if(pending)status.textContent='Ieškoma vietų netoliese…';
    else if(failed)status.textContent='Vietų nepavyko įkelti. Bandykite dar kartą.';
    else if(loaded)status.textContent=[...selected].map(key=>`${categories[key].label}: ${layers[key].getLayers().length}`).join(' · ')+' · 2 km · OpenStreetMap';
  }
  async function loadPlaces(){
    if(loaded||pending)return;
    failed=false;
    pending=(async()=>{
      const around=`(around:2000,${latitude},${longitude})`;
      const query=`[out:json][timeout:20];(nwr[amenity=school]${around};nwr[shop][shop!="vacant"][shop!="no"]${around};nwr[leisure~"^(fitness_centre|sports_centre)$"]${around};);out center tags;`;
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),25000);
      try{
        const response=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',body:new URLSearchParams({data:query}),signal:controller.signal});
        if(!response.ok)throw new Error('Nearby service unavailable');
        const data=await response.json();
        if(data.remark||!Array.isArray(data.elements))throw new Error('Incomplete nearby response');
        Object.values(layers).forEach(layer=>layer.clearLayers());
        const seen=new Set();
        for(const place of data.elements){
          const tags=place.tags||{};
          const point=[place.lat??place.center?.lat,place.lon??place.center?.lon];
          if(!point.every(Number.isFinite))continue;
          const key=tags.amenity==='school'?'schools':tags.shop?'shops':'sports';
          const config=categories[key];
          const name=tags['name:lt']||tags.name||tags.brand||config.fallback;
          const dedup=`${key}:${name}:${point.map(n=>n.toFixed(4)).join(',')}`;
          if(seen.has(dedup))continue;
          seen.add(dedup);
          const popup=document.createElement('div');
          const title=document.createElement('strong');title.textContent=name;popup.append(title);
          const distance=document.createElement('p');distance.textContent=`Apie ${Math.round(map.distance([latitude,longitude],point)/10)*10} m tiesia linija nuo pavyzdinio taško`;popup.append(distance);
          const address=[tags['addr:street'],tags['addr:housenumber']].filter(Boolean).join(' ');
          if(address){const text=document.createElement('p');text.textContent=address;popup.append(text);}
          if(['node','way','relation'].includes(place.type)&&Number.isSafeInteger(place.id)){
            const link=document.createElement('a');link.textContent='Peržiūrėti OpenStreetMap ↗';link.href=`https://www.openstreetmap.org/${place.type}/${place.id}`;link.target='_blank';link.rel='noopener noreferrer';popup.append(link);
          }
          const poiIcon=L.divIcon({className:'poi-marker',iconSize:[32,32],iconAnchor:[16,16],popupAnchor:[0,-16],html:`<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="${config.color}" stroke="#f8f6f2" stroke-width="2"/><path d="${config.path}" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`});
          L.marker(point,{icon:poiIcon,title:name,alt:name,zIndexOffset:-100}).bindPopup(popup).addTo(layers[key]);
        }
        loaded=true;
      }catch(error){failed=true;}finally{clearTimeout(timer);}
    })();
    update();
    await pending;
    pending=null;
    update();
  }
  document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{
    const key=button.dataset.category;
    if(selected.has(key))selected.delete(key);else selected.add(key);
    button.setAttribute('aria-pressed',selected.has(key));
    if(selected.size&&!loaded&&!pending)loadPlaces();
    update();
  }));
  retry.addEventListener('click',loadPlaces);
}
