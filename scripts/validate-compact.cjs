// Run against `npm start` built with a local placeholder Supabase URL.
// All account/database traffic is intercepted; no live service is used.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:3000';
const output = process.env.TEST_OUTPUT || '/tmp/iggy-v96-validation';
fs.mkdirSync(output, { recursive: true });
const now = Date.now();
const user = { id:'00000000-0000-4000-8000-000000000001', email:'fixture@example.test', aud:'authenticated', role:'authenticated' };
const pets = Array.from({length:14}, (_, i) => ({id:`fixture-${i}`,name:i === 0 ? 'Clementine' : `Willow ${i+1}`,speciesKey:['king','rock','nun'][i%3],colorKey:['tan','slate','black'][i%3],stage:i === 13 ? 'baby' : 'adult',gender:i%2?'f':'m',lastFedAt:now,lastCleanedAt:now,createdAt:now-86400000,growAt:now+3600000,strength:2,wisdom:2,life:100,maxLife:100,outfitKey:i === 0 ? 'apple_harvest' : null,appearance:{eyeColor:'brown',eyeStyle:'gentle'},wardrobeSlots:i === 0?{full:'apple_harvest'}:{}}));
const profile = {id:user.id,username:'MeadowGuardian',created_at:'2026-01-01T00:00:00Z',role:'player',birds:pets,streak:4,loft_capacity:14};
const save = {user_id:user.id,seeds:1200,birds:pets,loft_capacity:14,upgrades_bought:5,decorations:[],last_collect_at:now,last_login_date:new Date().toISOString().slice(0,10),streak:4,flags:{wardrobeInventory:['none','ribbon','apple_harvest'],guidedMeadow:false}};
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.TEST_BROWSER||chromium.executablePath(),args:JSON.parse(process.env.TEST_BROWSER_ARGS||'[]')});
 const report={pages:[],errors:[],assetFailures:[],saveCompatibility:false,pagination:{}};
 for(const [width,height] of [[1280,640],[1366,768],[1920,1080],[390,844]]){
  console.log(`Checking ${width} × ${height}`);
  const context=await browser.newContext({viewport:{width,height},serviceWorkers:'block'});let latestSave;
  await context.addInitScript(({user})=>localStorage.setItem('sb-127-auth-token',JSON.stringify({access_token:'fixture-token',refresh_token:'fixture-refresh',expires_at:Math.floor(Date.now()/1000)+86400,expires_in:86400,token_type:'bearer',user})),{user});
  const page=await context.newPage();page.on('pageerror',error=>report.errors.push(error.message));page.on('response',r=>{if(r.url().includes('/art/')&&r.status()>=400)report.assetFailures.push(r.url());});
  await context.route('http://127.0.0.1:54321/**',async route=>{const request=route.request();const url=new URL(request.url());let data=[];
   if(url.pathname.includes('/auth/v1/'))data={user};
   if(url.pathname.includes('/profiles')||url.pathname.includes('/public_profiles'))data=profile;
   if(url.pathname.includes('/game_config'))data={config:{}};
   if(url.pathname.includes('/premium_wallets'))data={bones:7};
   if(url.pathname.includes('/player_saves')){data=save;if(request.method()==='PATCH'){latestSave=request.postDataJSON();data=null;}}
   await route.fulfill({status:data===null?204:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:data===null?'':JSON.stringify(data)});
  });
  async function snapshot(name){
   await page.waitForTimeout(100);await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await Promise.race([Promise.all([...document.images].map(i=>i.complete?Promise.resolve():new Promise(r=>{i.addEventListener('load',r,{once:true});i.addEventListener('error',r,{once:true});}))),new Promise(r=>setTimeout(r,3000))]);await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
   const metrics=await page.evaluate(()=>({docHeight:document.documentElement.scrollHeight,docWidth:document.documentElement.scrollWidth,viewHeight:innerHeight,viewWidth:innerWidth,broken:[...document.images].filter(i=>i.naturalWidth===0).map(i=>i.getAttribute('src'))}));
   await page.screenshot({path:path.join(output,`${name}-${width}.png`),fullPage:false});
   const okay=metrics.docWidth<=width+1&&(width<1000||metrics.docHeight<=height+1)&&metrics.broken.length===0;
   report.pages.push({name,width,height,passed:okay,...metrics});console.log(`${name}: ${metrics.docHeight}px ${okay?'PASS':'FAIL'}`);
   fs.writeFileSync(path.join(output,'compact-validation.json'),JSON.stringify(report,null,2));
  }
  const quick=name=>page.locator('.meadow-quicktrail button').filter({hasText:new RegExp(`^${name}$`)}).click();
  const primary=name=>page.locator('.meadow-mainnav button').filter({hasText:new RegExp(name)}).click();
  await page.goto(origin,{waitUntil:'domcontentloaded'});await page.locator('.compact-home').waitFor();await snapshot('home');
  if(width===1280){for(const name of ['Daily Board','Gazette','Meadow Promise']){await page.getByRole('navigation',{name:'Home pages'}).getByRole('button',{name,exact:true}).click();await snapshot(`home-${name.toLowerCase().replaceAll(' ','-')}`);}await page.getByRole('button',{name:'Meadow Plaza',exact:true}).click();}
  await primary('My Iggies');await snapshot('kennel');
  const seen=new Set();do{for(const text of await page.locator('.pet-card .bname').allTextContents())seen.add(text);const next=page.getByRole('button',{name:'Next →',exact:true});if(!await next.count()||await next.isDisabled())break;await next.click();}while(seen.size<=14);assert.equal(seen.size,14);report.pagination.kennel=14;
  await page.locator('.pet-card').first().click();await page.getByRole('dialog').waitFor();await snapshot('iggy-profile');const dialogRect=await page.getByRole('dialog').evaluate(e=>{const r=e.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom};});assert(dialogRect.left>=-1&&dialogRect.top>=-1&&dialogRect.right<=width+1&&dialogRect.bottom<=height+1);await page.keyboard.press('Tab');assert(await page.evaluate(()=>!!document.activeElement.closest('[role="dialog"]')));await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
  await primary('Adoption House');await snapshot('adoption');assert.equal(await page.locator('.adoption-card .btn:not(:disabled)').count(),0);
  if(width===1280){await page.getByRole('button',{name:'Breed',exact:true}).click();await snapshot('breeding');}
  await primary('Market Lane');await snapshot('market-decorations');
  if(width===1280){for(const name of ['Training','Kennel Space','Seeds']){await page.getByRole('navigation',{name:'Meadow Shop shelves'}).getByRole('button',{name,exact:true}).click();await snapshot(`market-${name.toLowerCase().replaceAll(' ','-')}`);}}
  await page.getByRole('navigation',{name:'Meadow Shop shelves'}).getByRole('button',{name:'Special Dog Bones',exact:true}).click();await snapshot('special-bones');assert.equal(await page.locator('.bone-balance strong').innerText(),'7');
  await page.locator('.shop-subnav').getByRole('button',{name:'Wardrobe',exact:true}).click();await snapshot('wardrobe');await page.getByLabel('Dressing room Iggy').selectOption('fixture-13');assert((await page.locator('.dresser-info h3').innerText()).includes('Willow 14'));assert.equal(await page.getByRole('dialog').count(),0);
  if(width===1280){for(const name of ['Eye Studio','Art Archive']){await page.getByRole('navigation',{name:'Boutique sections'}).getByRole('button',{name,exact:true}).click();await snapshot(`wardrobe-${name.toLowerCase().replaceAll(' ','-')}`);if(name==='Eye Studio'){await page.getByRole('button',{name:'Eye Styles',exact:true}).click();await snapshot('wardrobe-eye-styles');}}await page.getByRole('button',{name:'Seasonal Outfits',exact:true}).click();const titles=new Set();do{for(const text of await page.locator('.wardrobe-card-title h3').allTextContents())titles.add(text);const next=page.getByRole('navigation',{name:'Outfits pages'}).getByRole('button',{name:'Next →'});if(await next.isDisabled())break;await next.click();}while(titles.size<=6);assert.equal(titles.size,6);report.pagination.outfits=6;}
  await page.locator('.shop-subnav').getByRole('button',{name:'Toy Chest',exact:true}).click();await snapshot('toys');
  await primary('Collection');await snapshot('collection');
  if(width===1280){for(const button of await page.locator('.collection-tabs button').all()){await button.click();await snapshot(`collection-${(await button.innerText()).replace(/[^a-z]/gi,'').slice(0,20)}`);}}
  await primary('Explore');await snapshot('explore');
  await primary('Games');await snapshot('games');
  if(width===1280){await page.getByRole('navigation',{name:'Games pages'}).getByRole('button',{name:'Next →'}).click();assert((await page.locator('.game-card .nm').allTextContents()).includes('Seed Catch'));report.pagination.games=8;}
  await primary('World & Events');await snapshot('world');
  if(width===1280){
   for(const name of ['Atlas','Routes']){await page.locator('.atlas-tabs').getByRole('button',{name:new RegExp(name)}).click();await snapshot(`world-${name.toLowerCase()}`);}
   await page.locator('.atlas-tabs').getByRole('button',{name:/World Map/}).click();
   await page.locator('.compact-world-destinations button').filter({hasText:/Bramblewick/}).click();await page.getByRole('button',{name:'Enter destination →'}).click();await snapshot('bramblewick');
   for(const button of await page.locator('.bramblewick-tabs button').all()){await button.click();await snapshot(`bramblewick-${(await button.innerText()).replace(/[^a-z]/gi,'').slice(0,20)}`);}
   await page.getByRole('button',{name:'← World Map',exact:true}).click();await page.locator('.compact-world-destinations button').filter({hasText:/Whispering Woods/}).click();await page.getByRole('button',{name:'Enter destination →'}).click();await snapshot('woods');await page.getByRole('button',{name:'Woodland Journal',exact:true}).click();await snapshot('woods-journal');
   await page.getByRole('button',{name:'← World Map',exact:true}).click();
   for(const name of ['Frostpeak','Fall Grove']){await page.locator('.compact-world-destinations button').filter({hasText:new RegExp(name)}).click();await page.getByRole('button',{name:'Enter destination →'}).click();await snapshot(`season-${name.toLowerCase().replaceAll(' ','-')}`);await page.getByRole('button',{name:'Seasonal Highlights',exact:true}).click();await snapshot(`season-${name.toLowerCase().replaceAll(' ','-')}-highlights`);await page.getByRole('button',{name:'← Back to map',exact:true}).click();}
  }
  await page.waitForTimeout(800);assert(latestSave);assert.equal(latestSave.birds.length,14);assert.equal(latestSave.loft_capacity,14);assert.equal(latestSave.seeds,1200);assert.equal(latestSave.birds[0].outfitKey,'apple_harvest');assert(!('bones' in latestSave));report.saveCompatibility=true;
  await page.goto(`${origin}/profile/MeadowGuardian`,{waitUntil:'domcontentloaded'});await page.locator('.public-iggy-card').first().waitFor();await snapshot('public-profile');const publicSeen=new Set();do{for(const text of await page.locator('.public-iggy-card h3').allTextContents())publicSeen.add(text);const next=page.getByRole('navigation',{name:'Family Iggies pages'}).getByRole('button',{name:'Next →'});if(!await next.count()||await next.isDisabled())break;await next.click();}while(publicSeen.size<=14);assert.equal(publicSeen.size,14);report.pagination.publicProfile=14;
  await page.getByRole('button',{name:'Meadow Milestones',exact:true}).click();await snapshot('public-milestones');
  for(const name of ['login','signup']){await page.goto(`${origin}/${name}`,{waitUntil:'domcontentloaded'});await snapshot(name);}
  await context.close();
 }
 fs.writeFileSync(path.join(output,'compact-validation.json'),JSON.stringify(report,null,2));await browser.close();
 const failed=report.pages.filter(p=>!p.passed);console.log('Failed views:',JSON.stringify(failed.map(({name,width,docHeight})=>({name,width,docHeight}))));assert.deepEqual(failed,[]);assert.deepEqual(report.errors,[]);assert.deepEqual(report.assetFailures,[]);console.log(`PASS: ${report.pages.length} viewport checks, pagination and save compatibility`);
})().catch(e=>{console.error(e);process.exit(1)});
