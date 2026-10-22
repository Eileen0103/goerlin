
const menuButton=document.querySelector('.menu-button');
const siteNav=document.querySelector('#site-nav');
function closeMenu(restoreFocus=false){siteNav?.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');menuButton?.setAttribute('aria-label','開啟選單');if(menuButton)menuButton.textContent='☰';if(restoreFocus)menuButton?.focus();}
menuButton?.addEventListener('click',()=>{const open=siteNav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'關閉選單':'開啟選單');menuButton.textContent=open?'✕':'☰';});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&siteNav?.classList.contains('open'))closeMenu(true);});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
siteNav?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
window.matchMedia('(min-width:761px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
const topButton=document.querySelector('.back-top');
function updateTopButton(){if(topButton)topButton.hidden=window.scrollY<650;}
window.addEventListener('scroll',updateTopButton,{passive:true});updateTopButton();
topButton?.addEventListener('click',()=>{window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});document.querySelector('.wordmark')?.focus({preventScroll:true});});
const filterButtons=document.querySelectorAll('[data-season-filter]');
const seasonCards=document.querySelectorAll('[data-season]');
filterButtons.forEach(button=>button.addEventListener('click',()=>{const season=button.dataset.seasonFilter;filterButtons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));seasonCards.forEach(card=>{card.hidden=season!=='all'&&card.dataset.season!==season;});const status=document.querySelector('.filter-status');if(status)status.textContent=season==='all'?'全年核心行程不變，四季各有不同亮點。':'正在查看'+button.textContent+'；點選景點卡片可閱讀完整介紹。';}));
const pastry=document.querySelector('#include-pastry');
pastry?.addEventListener('change',()=>{const each=4965+(pastry.checked?380:0);document.querySelector('#estimated-person').textContent='NT$ '+each.toLocaleString('en-US');document.querySelector('#estimated-group').textContent='NT$ '+(each*20).toLocaleString('en-US');});

// Native dialogs keep visitors on their original card and preserve page position.
const detailDialog=document.querySelector('#detail-modal');
if(detailDialog&&typeof detailDialog.showModal==='function'){
 let openingCard=null;let previousOverflow='';
 document.querySelectorAll('[data-detail-modal]').forEach(card=>card.addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const template=document.getElementById('preview-'+card.dataset.detailModal);
  if(!template)return;
  event.preventDefault();openingCard=card;
  document.querySelector('#modal-heading').textContent=card.dataset.detailTitle;
  document.querySelector('#modal-content').replaceChildren(template.content.cloneNode(true));
  previousOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';
  detailDialog.showModal();document.querySelector('#modal-content').scrollTop=0;
 }));
 detailDialog.querySelector('.modal-close').addEventListener('click',()=>detailDialog.close());
 let pointerOnBackdrop=false;
 detailDialog.addEventListener('pointerdown',event=>{pointerOnBackdrop=event.target===detailDialog;});
 detailDialog.addEventListener('click',event=>{if(pointerOnBackdrop&&event.target===detailDialog){const r=detailDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)detailDialog.close();}pointerOnBackdrop=false;});
 detailDialog.addEventListener('close',()=>{document.documentElement.style.overflow=previousOverflow;openingCard?.focus({preventScroll:true});document.querySelector('#modal-content').replaceChildren();});
}

// Audience tabs update the selected group type.
const groupTabs=Array.from(document.querySelectorAll('[data-group]'));
function selectGroup(tab,moveFocus=false){groupTabs.forEach(item=>{const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!active;});if(moveFocus)tab.focus();const select=document.querySelector('[name="groupType"]');if(select)select.value=['企業／員工旅遊','里民／家族／社團','學生／戶外教學'][groupTabs.indexOf(tab)];}
groupTabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectGroup(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%groupTabs.length;if(event.key==='ArrowLeft')next=(index+groupTabs.length-1)%groupTabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=groupTabs.length-1;if(next!==undefined){event.preventDefault();selectGroup(groupTabs[next],true);}});});

// Manual gallery navigation; autoplay begins only when explicitly requested.
const galleryData=document.querySelector('#stay-gallery-data');
if(galleryData){
 const slides=JSON.parse(galleryData.textContent);let current=0;let timer=null;
 const lightbox=document.querySelector('#stay-lightbox');const enlarge=document.querySelector('.gallery-enlarge');
 const mainImage=document.querySelector('#stay-gallery-image');const largeImage=document.querySelector('#stay-lightbox-image');
 const play=document.querySelector('#gallery-play');
 function displaySlide(index){current=(index+slides.length)%slides.length;const slide=slides[current];mainImage.src=slide.src;mainImage.alt=slide.alt;largeImage.src=slide.src;largeImage.alt=slide.alt;document.querySelector('#stay-gallery-label').textContent=slide.label;document.querySelector('#stay-gallery-count').textContent=(current+1)+' / '+slides.length;document.querySelector('#lightbox-caption').textContent=slide.label+' · '+(current+1)+' / '+slides.length;document.querySelectorAll('[data-gallery-index]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.galleryIndex)===current)));}
 function stopPlayback(){if(timer)clearInterval(timer);timer=null;play.textContent='自動播放';play.setAttribute('aria-pressed','false');}
 document.querySelectorAll('[data-gallery-prev]').forEach(button=>button.addEventListener('click',()=>{stopPlayback();displaySlide(current-1);}));
 document.querySelectorAll('[data-gallery-next]').forEach(button=>button.addEventListener('click',()=>{stopPlayback();displaySlide(current+1);}));
 document.querySelectorAll('[data-gallery-index]').forEach(button=>button.addEventListener('click',()=>{stopPlayback();displaySlide(Number(button.dataset.galleryIndex));}));
 play.addEventListener('click',()=>{if(timer){stopPlayback();return;}play.textContent='暫停播放';play.setAttribute('aria-pressed','true');timer=setInterval(()=>displaySlide(current+1),4000);});
 enlarge.addEventListener('click',()=>{stopPlayback();displaySlide(current);if(typeof lightbox.showModal==='function')lightbox.showModal();});
 document.querySelector('#close-stay-lightbox').addEventListener('click',()=>lightbox.close());
 lightbox.addEventListener('close',()=>enlarge.focus({preventScroll:true}));
 lightbox.addEventListener('click',event=>{if(event.target===lightbox){const bounds=lightbox.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)lightbox.close();}});
 lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();stopPlayback();displaySlide(current+(event.key==='ArrowLeft'?-1:1));}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPlayback();});
}
// Delivery remains inactive until an approved receiving endpoint is configured.
const inquiryForm=document.querySelector('#group-plan-form');
if(inquiryForm){const sendButton=document.querySelector('#send-inquiry');const status=document.querySelector('#inquiry-status');const endpoint=inquiryForm.dataset.inquiryEndpoint;
 if(endpoint){sendButton.disabled=false;status.textContent='';}
 inquiryForm.addEventListener('submit',async event=>{event.preventDefault();if(!inquiryForm.reportValidity())return;if(!endpoint){status.textContent='線上需求受理尚未開放，需求尚未送出。';return;}sendButton.disabled=true;status.textContent='正在傳送，請稍候……';try{const response=await fetch(endpoint,{method:'POST',body:new FormData(inquiryForm),headers:{'Accept':'application/json'}});if(!response.ok)throw new Error('delivery failed');status.textContent='需求已送出，我們將於2–3個工作天內回覆。';inquiryForm.reset();}catch{status.textContent='目前未能完成傳送，請稍後再試；需求尚未送出。';}finally{sendButton.disabled=false;}});
}

// One compact switch follows the navigation links, on both reading versions.
document.querySelectorAll('[data-audience-target]').forEach(button=>button.addEventListener('click',()=>{window.location.assign(button.dataset.audienceTarget);}));
function isValidMobile(value){return /^09[0-9]{8}$/.test(value);}
function isValidContactEmail(value){
 if(!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,63}$/.test(value))return false;
 const parts=value.split('@');if(parts.length!==2||parts[0].startsWith('.')||parts[0].endsWith('.')||parts[0].includes('..'))return false;
 return parts[1].split('.').every(label=>/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label));
}
if(inquiryForm){
 const fields=Array.from(inquiryForm.querySelectorAll('input[required],select[required]'));
 function validateInquiryField(field,showError=true){
  field.setCustomValidity('');let message='';const value=field.value.trim();
  if(!value)message='請填寫此必填欄位。';
  else if(field.name==='phone'&&!isValidMobile(value))message='請填09開頭、共10碼的手機號碼，例如0912345678。';
  else if(field.name==='email'&&!isValidContactEmail(value))message='請填完整信箱，包含@與網域後綴，例如name@example.com。';
  else if(field.name==='contactName'&&(value.length<2||!/[\p{L}]/u.test(value)))message='請填寫完整聯絡人姓名，至少2個字元且需包含文字。';
  else if(field.name==='date'&&field.validity.badInput)message='請選擇有效日期。';
  else if(!field.validity.valid)message='請確認填寫格式正確。';
  field.setCustomValidity(message);
  if(showError){field.setAttribute('aria-invalid',String(Boolean(message)));const error=document.getElementById('error-'+field.name);if(error)error.textContent=message;}
  return !message;
 }
 fields.forEach(field=>{field.addEventListener('blur',()=>{if(field.name==='email'||field.name==='contactName')field.value=field.value.trim();validateInquiryField(field);});field.addEventListener('input',()=>validateInquiryField(field,field.getAttribute('aria-invalid')==='true'));field.addEventListener('change',()=>validateInquiryField(field));field.addEventListener('invalid',()=>validateInquiryField(field));});
 inquiryForm.addEventListener('submit',()=>fields.forEach(field=>validateInquiryField(field)),{capture:true});
}
