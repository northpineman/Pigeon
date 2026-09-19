// Run against `npm start` built with a local placeholder Supabase URL.
// All account/database traffic is intercepted; no live service is used.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:3000';
const output = process.env.TEST_OUTPUT || '/tmp/iggy-v95-validation';
fs.mkdirSync(output, { recursive: true });
const now = Date.now();
const user = { id:'00000000-0000-4000-8000-000000000001', email:'fixture@example.test', aud:'authenticated', role:'authenticated' };
const pets = Array.from({length:14}, (_, i) => ({id:`fixture-${i}`,name:i === 0 ? 'Clementine' : `Willow ${i+1}`,speciesKey:['king','rock','nun'][i%3],colorKey:['tan','slate','black'][i%3],stage:i === 13 ? 'baby' : 'adult',gender:i%2?'f':'m',lastFedAt:now,lastCleanedAt:now,createdAt:now-86400000,growAt:now+3600000,strength:2,wisdom:2,life:100,maxLife:100,outfitKey:i === 0 ? 'apple_harvest' : null,appearance:{eyeColor:'brown',eyeStyle:'gentle'},wardrobeSlots:i === 0?{full:'apple_harvest'}:{}}));
const profile = {id:user.id,username:'MeadowGuardian',created_at:'2026-01-01T00:00:00Z',role:'player',birds:pets,streak:4,loft_capacity:14};
const save = {user_id:user.id,seeds:1200,birds:pets,loft_capacity:14,upgrades_bought:5,decorations:[],last_collect_at:now,last_login_date:new Date().toISOString().slice(0,10),streak:4,flags:{wardrobeInventory:['none','ribbon','apple_harvest'],guidedMeadow:false}};
(async()=>{
 const browser = await chromium.launch({headless:true, executablePath:process.env.TEST_BROWSER || chromium.executablePath(),args:JSON.parse(process.env.TEST_BROWSER_ARGS || "[]")});
 console.log('Browser launched');
 const report = {pages:[],consoleErrors:[],assetFailures:[],saveCompatibility:false};
 for(const width of [1440,768,390]){
  console.log(`Checking ${width}px`);
  const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block'});
  await context.addInitScript(({user})=>{localStorage.setItem('sb-127-auth-token',JSON.stringify({access_token:'fixture-token',refresh_token:'fixture-refresh',expires_at:Math.floor(Date.now()/1000)+86400,expires_in:86400,token_type:'bearer',user}));},{user});
  const page=await context.newPage();let latestSave;
  page.on('request',r=>fs.appendFileSync(path.join(output,'trace.log'),r.method()+' '+r.url()+'\n'));
  page.on('console',m=>fs.appendFileSync(path.join(output,'trace.log'),'CONSOLE '+m.text()+'\n'));
  page.on('pageerror',error=>report.consoleErrors.push(error.message));
  page.on('response',response=>{if(response.url().includes('/art/') && response.status()>=400)report.assetFailures.push(response.url());});
  await context.route('http://127.0.0.1:54321/**',async route=>{
   const request=route.request(); const url=new URL(request.url());let data=[];
   if(url.pathname.includes('/auth/v1/'))data={user};
   if(url.pathname.includes('/profiles'))data=profile;
   if(url.pathname.includes('/public_profiles'))data=profile;
   if(url.pathname.includes('/game_config'))data={config:{}};
   if(url.pathname.includes('/premium_wallets'))data={bones:7};
   if(url.pathname.includes('/player_saves')){data=save;if(request.method()==='PATCH'){latestSave=request.postDataJSON();data=null;}}
   await route.fulfill({status:data===null?204:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:data===null?'':JSON.stringify(data)});
  });
  console.log('Opening game');await page.goto(origin,{waitUntil:'domcontentloaded'});console.log('Game document loaded');await page.locator('.meadow-masthead').waitFor();
  async function snapshot(name){
   await page.waitForTimeout(250);
   await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await Promise.race([Promise.all([...document.images].map(img=>img.complete?Promise.resolve():new Promise(r=>{img.addEventListener('load',r,{once:true});img.addEventListener('error',r,{once:true});}))),new Promise(r=>setTimeout(r,5000))]);});
   const dims=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,view:innerWidth,broken:[...document.images].filter(i=>i.naturalWidth===0).map(i=>i.getAttribute('src'))}));
   assert(dims.doc<=dims.view+1,`${name} ${width}: page overflow ${dims.doc}`);assert.deepEqual(dims.broken,[],`${name}: broken artwork`);
   await page.screenshot({path:path.join(output,`${name}-${width}.png`),fullPage:name!=="iggy-profile"});report.pages.push({name,width,overflow:false});
  }
  await snapshot('home');
  await page.locator('.meadow-brand-plaque').focus();await page.keyboard.press('Enter');assert(await page.locator('.meadow-home').isVisible());
  await page.locator('.meadow-quicktrail button').filter({hasText:/^Kennel$/}).click();await snapshot('kennel');
  await page.locator('.pet-card').first().click();await page.getByRole('dialog').waitFor();await snapshot('iggy-profile');assert(await page.locator('.iggy-profile-heading h2').evaluate(el=>el.getBoundingClientRect().right<=el.closest('[role="dialog"]').getBoundingClientRect().right-10),'Profile name must fit inside the dialog');assert(await page.locator('.iggy-profile-art img').evaluate(el=>el.getBoundingClientRect().bottom<=document.querySelector('.profile-tabs').getBoundingClientRect().top),'Profile outfit must not overlap section controls');
  await page.keyboard.press('Tab');assert(await page.evaluate(()=>!!document.activeElement.closest('[role="dialog"]')));
  await page.locator('.meadow-dialog-close').focus();await page.keyboard.press('Shift+Tab');assert(await page.evaluate(()=>!!document.activeElement.closest('[role="dialog"]')));
  await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);assert(await page.locator('.pet-card').first().evaluate(el=>el===document.activeElement));
  await page.locator('.meadow-quicktrail button').filter({hasText:/^Adopt$/}).click();await snapshot('adoption');
  assert.equal(await page.locator('.adoption-card .btn:not(:disabled)').count(),0,'14-Iggy cap must disable adoptions');
  await page.locator('.meadow-quicktrail button').filter({hasText:/^Market$/}).click();await snapshot('market');
  assert(await page.getByRole('heading',{name:'Special Dog Bones',exact:true}).isVisible());assert(await page.locator('.bone-balance strong').innerText()==='7');
  await page.locator('.meadow-quicktrail button').filter({hasText:/^Wardrobe$/}).click();await snapshot('wardrobe');
  await page.locator('.wardrobe-filters button').filter({hasText:/^Common$/}).click();assert(await page.locator('.meadow-empty-state').isVisible());await page.getByRole('button',{name:'Browse all looks'}).click();assert.equal(await page.locator('.wardrobe-card').count(),6);
  await page.locator('.dresser-select select').selectOption('fixture-13');assert((await page.locator('.dresser-info h3').innerText()).includes('Willow 14'),'14th Iggy must remain dressable');assert.equal(await page.getByRole('dialog').count(),0,'Boutique picker must not open a profile dialog');
  await page.waitForTimeout(800);if(latestSave){assert.equal(latestSave.birds.length,14);assert.equal(latestSave.loft_capacity,14);assert.equal(latestSave.seeds,1200);assert.equal(latestSave.birds[0].outfitKey,'apple_harvest');assert(!('bones' in latestSave));report.saveCompatibility=true;}
  await page.goto(`${origin}/profile/MeadowGuardian`,{waitUntil:'domcontentloaded'});await page.locator('.public-iggy-card').first().waitFor();await snapshot('public-profile');assert.equal(await page.locator('.public-iggy-card').count(),14);assert(await page.locator('.public-iggy-card').first().evaluate(el=>el.querySelector('img').getBoundingClientRect().bottom<=el.querySelector('h3').getBoundingClientRect().top),'Outfit art must not overlap the name plaque');
  await context.close();
 }
 assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.assetFailures,[]);assert(report.saveCompatibility);
 fs.writeFileSync(path.join(output,'validation.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
