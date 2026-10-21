-- Optional migration for conservation records. Run in the Supabase SQL Editor.
-- This creates only the new archive tables/bucket; existing site tables are untouched.
begin;
create table if not exists public.conservation_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.conservation_admins enable row level security;
revoke all on public.conservation_admins from anon, authenticated;

create or replace function public.is_conservation_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.conservation_admins where user_id = auth.uid()); $$;
revoke all on function public.is_conservation_admin() from public;
grant execute on function public.is_conservation_admin() to authenticated;

create table if not exists public.conservation_records (
  id text primary key,
  payload jsonb not null,
  status text not null check (status in ('draft','published','archived')),
  record_date text not null check (record_date ~ '^\d{4}(-\d{2})?(-\d{2})?$'),
  updated_at timestamptz not null default now(),
  constraint conservation_payload_identity check (payload->>'id' = id),
  constraint conservation_payload_status check (payload->>'status' = status),
  constraint conservation_payload_date check (payload->>'date' = record_date)
);
create index if not exists conservation_status_date on public.conservation_records(status,record_date desc);
alter table public.conservation_records enable row level security;
revoke all on public.conservation_records from anon, authenticated;
grant select on public.conservation_records to anon, authenticated;
grant insert,update on public.conservation_records to authenticated;
drop policy if exists conservation_public_read on public.conservation_records;
create policy conservation_public_read on public.conservation_records for select to anon,authenticated using (status = 'published');
drop policy if exists conservation_admin_read on public.conservation_records;
create policy conservation_admin_read on public.conservation_records for select to authenticated using (public.is_conservation_admin());
drop policy if exists conservation_admin_insert on public.conservation_records;
create policy conservation_admin_insert on public.conservation_records for insert to authenticated with check (public.is_conservation_admin());
drop policy if exists conservation_admin_update on public.conservation_records;
create policy conservation_admin_update on public.conservation_records for update to authenticated using (public.is_conservation_admin()) with check (public.is_conservation_admin());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('conservation-images','conservation-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
drop policy if exists conservation_image_read on storage.objects;
create policy conservation_image_read on storage.objects for select to anon,authenticated using (bucket_id = 'conservation-images');
drop policy if exists conservation_image_upload on storage.objects;
create policy conservation_image_upload on storage.objects for insert to authenticated with check (bucket_id = 'conservation-images' and public.is_conservation_admin());

-- Initial published records are appended below. Existing IDs are never overwritten.
insert into public.conservation_records(id,payload,status,record_date) values
('patrol-note-2018-03-02','{"id":"patrol-note-2018-03-02","title":"一张巡逻登记表里的日常守护","date":"2018-03-02","datePrecision":"day","category":"patrol","kind":"archive","status":"published","featured":true,"location":"洞庭湖水域","organizer":"岳阳市江豚保护协会","summary":"日期、时段、天气、路线与巡逻情况，被逐项写进纸质登记表。守护的日常，也有可以回看的原始记录。","body":"这份《岳阳市江豚保护协会巡逻登记表》在2026年7月14日的实践交流中被拍摄留存。原件日期栏为2018年3月2日，时间栏记录了8时至16时的巡逻时段。\n\n登记表还设置了交通工具、巡逻路线、天气和水文、参与人员、巡逻情况等栏目，呈现协会日常巡护的记录方式。\n\n本条目保留原件影像和能够辨识的时间信息，其余手写路线、人员及处置内容以原件和协会复核为准，未作推测性转录。","photos":[{"src":"/img/conservation/patrol-notebook.webp","caption":"协会纸质巡逻登记表；现场影像采集于2026年7月14日。"}],"sourceName":"岳阳市江豚保护协会巡逻登记表 · 实践团队现场影像","sourceUrl":"","sourceNote":"档案日期据原件日期栏整理；影像拍摄日与原始巡护日期分别保留。","metrics":{"durationHours":8},"tags":["纸质档案","巡护记录"]}'::jsonb,'published','2018-03-02'),
('association-report-2022','{"id":"association-report-2022","title":"水上巡护，守住江豚的栖息家园","date":"2022-03-31","datePrecision":"day","category":"patrol","kind":"report","status":"published","featured":false,"location":"东洞庭湖","organizer":"岳阳市江豚保护协会","summary":"公开报道记录了协会志愿者与渔政人员协同开展水上巡护的工作，也留下民间保护力量长期参与的足迹。","body":"智慧岳阳在2022年3月31日的报道中，记录了岳阳市江豚保护协会志愿者从东洞庭湖水上联合执法基地出发、与渔政人员共同开展巡护的情景。\n\n报道介绍，协会以日常巡护、监测救护和志愿服务等方式参与栖息地保护。这份公开资料作为协会长期行动的历史线索归入档案。","photos":[],"sourceName":"智慧岳阳 · 岳阳广电","sourceUrl":"https://www.0730news.com/detail?infoid=112770","sourceNote":"本条时间为报道发布日期，内容为原报道摘要；并非新录入的一次当日巡护日志。","metrics":{},"tags":["公开报道","协同巡护"]}'::jsonb,'published','2022-03-31'),
('association-report-2024','{"id":"association-report-2024","title":"在洞庭湖畔，带青年看见保护的意义","date":"2024-07-27","dateEnd":"2024-07-28","datePrecision":"day","category":"education","kind":"report","status":"published","featured":false,"location":"岳阳 · 洞庭湖","organizer":"岳阳市江豚保护协会、中南林业科技大学实践团队","summary":"青年学子走进协会，在交流与水域观察中了解江豚保护，把对自然的认识带回日常生活。","body":"据湖南日报·新湖南客户端2024年7月30日报道，中南林业科技大学“湘行寻梦”团队于7月27日至28日来到岳阳市江豚保护协会学习交流。\n\n活动围绕湿地、水环境与江豚保护展开，并在协会志愿者带领下开展水域观察。这份记录呈现了协会面向青年开展保护交流与自然教育的一次实践。","photos":[],"sourceName":"湖南日报·新湖南客户端","sourceUrl":"https://www.hunantoday.cn/news/xhn/202407/20366802.html","sourceNote":"活动日期及内容依据原报道整理；原报道发布于2024年7月30日。","metrics":{},"tags":["青年参与","自然教育"]}'::jsonb,'published','2024-07-27'),
('field-2026-association','{"id":"field-2026-association","title":"翻开巡护记录，共话长久守望","date":"2026-07-14","datePrecision":"day","category":"education","kind":"field","status":"published","featured":true,"location":"岳阳市江豚保护协会交流现场","organizer":"岳阳市江豚保护协会、湖北大学及湖南理工大学实践团队","summary":"从志愿者的讲述到一摞巡护登记表，理解保护工作如何在日常中积累，也思考怎样让这些记录得到持续保存。","body":"实践团队与协会保护工作者开展交流，了解民间巡护、保护宣传及公众参与的日常工作。现场展示的纸质巡护登记表，让保护行动有了具体而可回看的载体。\n\n团队结合计算机与化学专业背景，围绕影像整理、工作记录和公众科普等方向讨论数字平台的用途，记录协会经验与后续维护需求。","photos":[{"src":"/img/conservation/association-exchange.webp","caption":"两校实践团队与协会工作者交流。"},{"src":"/img/conservation/patrol-notebook.webp","caption":"现场展示的巡护登记表。"}],"sourceName":"2026年实践现场照片与团队整理材料","sourceUrl":"","sourceNote":"日期结合现场照片EXIF；不将本次交流等同于协会一次独立巡护。","metrics":{},"tags":["保护交流","数字归档"]}'::jsonb,'published','2026-07-14'),
('field-2026-nature-class','{"id":"field-2026-nature-class","title":"把江豚的故事，讲进孩子的课堂","date":"2026-07-14","datePrecision":"day","category":"education","kind":"field","status":"published","featured":true,"location":"岳阳 · 儿童自然教育课堂","organizer":"湖北大学、湖南理工大学实践团队与协作单位","summary":"用故事、问答和手作认识江豚，让保护江河成为孩子能够理解、愿意参与的小行动。","body":"围绕江豚的生活环境与保护主题，团队组织儿童自然教育课堂，通过图文讲述、互动问答和黏土手作，引导孩子认识水生动物与身边的江河。\n\n课堂影像与作品作为自然教育过程材料归档，可供协会后续开展同类活动时回看参考。","photos":[{"src":"/img/conservation/nature-class.webp","caption":"江豚主题自然教育课堂。"},{"src":"/img/conservation/clay-class.webp","caption":"在手作互动中认识江豚。"}],"sourceName":"实践团队现场摄影","sourceUrl":"","sourceNote":"活动日期据现场照片EXIF整理。","metrics":{},"tags":["儿童科普","手作体验"]}'::jsonb,'published','2026-07-14'),
('field-2026-patrol','{"id":"field-2026-patrol","title":"随船入湖，记录一条巡护线","date":"2026-07-15","datePrecision":"day","category":"patrol","kind":"field","status":"published","featured":true,"location":"岳阳 · 洞庭湖重点水域","organizer":"实践团队与渔政协作单位","summary":"随船观察湖面与沿岸环境，将行程、现场影像和工作见闻一同整理，让巡护过程留有依据。","body":"实践团队随船开展重点水域观察，沿途记录水面、岸线及沿岸活动，并在现场了解巡护与生态监管的联系。\n\n平台已有行程材料将该段往返巡护整理为约35公里。此处保留其估算口径，具体GPS轨迹以原始航迹核验结果为准。","photos":[{"src":"/img/conservation/patrol-boat.webp","caption":"随船开展水域观察的现场影像。"},{"src":"/img/conservation/lake-pier.webp","caption":"巡护出发水域与码头环境。"}],"sourceName":"实践团队巡护影像与现有行程记录","sourceUrl":"","sourceNote":"里程为既有实践材料中的约数；不作为专业航迹测量结果。","metrics":{"distanceKm":35},"tags":["随船巡护","现场观察"]}'::jsonb,'published','2026-07-15'),
('field-2026-water','{"id":"field-2026-water","title":"一份水样，留下现场快检记录","date":"2026-07-15","datePrecision":"day","category":"monitor","kind":"field","status":"published","featured":false,"location":"洞庭湖水域","organizer":"湖北大学、湖南理工大学实践团队","summary":"保留取样、比色与便携仪器快检的现场过程，让数值能够对应到具体的采集活动。","body":"团队在随船实践中采集水样，开展便携仪器和试剂快检，保留取样、比色及读数环节的现场照片。\n\n现有平台水样记录中，TDS为156 mg/L。该值属于实践现场快检材料，不能据此单独判断整片水域的水质等级，也不替代专业断面监测。","photos":[{"src":"/img/conservation/water-sampling.webp","caption":"现场水样比色与观察。"},{"src":"/img/conservation/field-test.webp","caption":"快检操作过程。"}],"sourceName":"实践现场影像及平台既有水样快检记录","sourceUrl":"","sourceNote":"照片按团队提供的7月15日现场资料归档；数值来源为原项目dashboard.json。","metrics":{"tds":156},"tags":["水样快检","过程留存"]}'::jsonb,'published','2026-07-15'),
('field-2026-bank','{"id":"field-2026-bank","title":"用现场影像，留住湖岸的模样","date":"2026-07-16","datePrecision":"day","category":"monitor","kind":"field","status":"published","featured":false,"location":"岳阳 · 洞庭湖岸线","organizer":"实践团队","summary":"记录水面、植被与岸线空间，形成能够与后续同地点拍摄相互对照的现场影像。","body":"现场摄影记录了湖岸植被、水面与周边环境的空间关系，作为岸线影像材料留存。\n\n长期回看同一地点的影像，需要同时保留拍摄时间、位置和视角。本条目记录的是一次现场摄影材料，不由单幅照片推断生态变化幅度。","photos":[{"src":"/img/conservation/wetland-bank.webp","caption":"洞庭湖岸线现场摄影，2026年7月16日。"},{"src":"/img/conservation/lake-hero.webp","caption":"同日水面与湖岸植被记录。"}],"sourceName":"实践团队现场摄影","sourceUrl":"","sourceNote":"日期据照片EXIF整理；地点保留材料所提供的湖岸范围。","metrics":{},"tags":["湖岸影像","环境记录"]}'::jsonb,'published','2026-07-16'),
('field-2026-community','{"id":"field-2026-community","title":"在社区对话中，听见公众的保护关切","date":"2026-07-16","datePrecision":"day","category":"education","kind":"field","status":"published","featured":false,"location":"岳阳 · 公众调研现场","organizer":"两校社会实践团队","summary":"通过问卷与访谈听取居民对江豚、岸线环境和日常保护行动的理解，为后续科普提供现场参照。","body":"实践团队围绕江豚保护与生态认知开展公众问卷交流，记录居民的关注点与问题。\n\n材料用于完善科普选题与活动表达，不将个别访谈直接推广为所有公众的观点。","photos":[{"src":"/img/conservation/community-survey.webp","caption":"生态保护问卷与公众交流现场。"}],"sourceName":"实践团队现场照片与问卷活动整理","sourceUrl":"","sourceNote":"照片拍摄日期据EXIF整理。","metrics":{},"tags":["公众参与","问卷交流"]}'::jsonb,'published','2026-07-16'),
('field-2026-cleanup','{"id":"field-2026-cleanup","title":"弯腰拾起垃圾，也把行动记下来","date":"2026-07","datePrecision":"month","category":"cleanup","kind":"field","status":"published","featured":true,"location":"洞庭湖沿岸","organizer":"实践团队","summary":"在岸边开展清滩志愿行动，保留现场过程，为后续同类行动积累图像和工作资料。","body":"实践团队在沿岸开展清滩行动，清理可见垃圾，并将现场影像归入实践材料。\n\n当前材料尚未核验本次清理重量、人数和具体活动日，因此按2026年7月归档，保留现场过程，不填入推测性统计。","photos":[{"src":"/img/conservation/shore-cleanup.webp","caption":"洞庭湖沿岸清滩志愿行动。"}],"sourceName":"实践团队提供的2026年7月现场影像","sourceUrl":"","sourceNote":"现有材料可确认活动月份，具体日期与称重记录可由协会后续补录。","metrics":{},"tags":["志愿净滩","岸线守护"]}'::jsonb,'published','2026-07')
on conflict(id) do nothing;
commit;

-- After creating the association editor in Authentication > Users,
-- use the SQL Editor to add that user's UUID (replace the example):
-- insert into public.conservation_admins(user_id) values ('YOUR-USER-UUID');
-- Keep self-service signups disabled for an association-only administration site.
