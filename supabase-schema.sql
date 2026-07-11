-- =====================================================
-- 洞庭湖生态数据平台 - Supabase 数据库 Schema
-- 在 Supabase SQL Editor 中一次性执行全部
-- =====================================================

-- 1. 口述史人物
CREATE TABLE IF NOT EXISTS interviews (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  identity TEXT DEFAULT '',
  summary TEXT DEFAULT '',
  quote TEXT DEFAULT '',
  photo TEXT DEFAULT '/img/placeholder-person.jpg',
  audio TEXT DEFAULT NULL,
  audio_segments JSONB DEFAULT '[]',
  transcript TEXT DEFAULT '',
  photos JSONB DEFAULT '["/img/placeholder-person.jpg"]',
  timeline JSONB DEFAULT '[]',
  waveform TEXT DEFAULT NULL,
  sentiment JSONB DEFAULT NULL,
  keywords JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 岸线点位
CREATE TABLE IF NOT EXISTS geo_points (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  lat FLOAT NOT NULL DEFAULT 29.38,
  lng FLOAT NOT NULL DEFAULT 113.0,
  description TEXT DEFAULT '',
  before_img TEXT DEFAULT '',
  after_img TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS geo_patrol (
  id INTEGER PRIMARY KEY DEFAULT 1,
  track JSONB DEFAULT '[]',
  fishermen_points JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 数据看板 (单行)
CREATE TABLE IF NOT EXISTS dashboard (
  id INTEGER PRIMARY KEY DEFAULT 1,
  water_quality JSONB NOT NULL DEFAULT '{"years":[2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026],"chl_a":[18.5,17.2,16.8,15.9,14.3,13.7,12.1,11.5,10.8,10.2,9.6],"turbidity":[85,82,78,75,71,68,65,60,58,55,52]}',
  vegetation JSONB NOT NULL DEFAULT '{"hualong":0.72,"dongting":0.85}',
  ndvi JSONB NOT NULL DEFAULT '{"years":[2016,2022,2026],"hualong":[0.35,0.58,0.72],"dongting":[0.62,0.78,0.85]}',
  cleanup JSONB NOT NULL DEFAULT '{"hualong":{"plastic":0,"net":0,"foam":0,"other":0},"fishery":{"plastic":0,"net":0,"foam":0,"other":0}}',
  patrol JSONB NOT NULL DEFAULT '{"distance_km":0,"duration_h":0,"area_km2":0}',
  finless_porpoise JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 答题
CREATE TABLE IF NOT EXISTS quiz (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL DEFAULT '',
  options JSONB NOT NULL DEFAULT '["","","",""]',
  answer INTEGER NOT NULL DEFAULT 0,
  explanation TEXT DEFAULT ''
);

-- 5. 课堂反馈
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL DEFAULT '',
  author TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 作品墙
CREATE TABLE IF NOT EXISTS artworks (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 课堂统计
CREATE TABLE IF NOT EXISTS classrooms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  avg_score FLOAT DEFAULT 0,
  total_students INTEGER DEFAULT 0
);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE geo_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE geo_patrol ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;

-- 所有人可读
CREATE POLICY "public_read" ON interviews FOR SELECT USING (true);
CREATE POLICY "public_read" ON geo_points FOR SELECT USING (true);
CREATE POLICY "public_read" ON geo_patrol FOR SELECT USING (true);
CREATE POLICY "public_read" ON dashboard FOR SELECT USING (true);
CREATE POLICY "public_read" ON quiz FOR SELECT USING (true);
CREATE POLICY "public_read" ON feedback FOR SELECT USING (true);
CREATE POLICY "public_read" ON artworks FOR SELECT USING (true);
CREATE POLICY "public_read" ON classrooms FOR SELECT USING (true);

-- 只有认证用户可写
CREATE POLICY "auth_insert" ON interviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON interviews FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON interviews FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_insert" ON geo_points FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON geo_points FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON geo_points FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_all" ON geo_patrol FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_all" ON dashboard FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_insert" ON quiz FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON quiz FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON quiz FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_insert" ON feedback FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON feedback FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON feedback FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_insert" ON artworks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON artworks FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_all" ON classrooms FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 种子数据（可选 — 和 src/data/*.json 保持一致）
-- =====================================================

INSERT INTO interviews (id, name, identity, summary, quote, photo, transcript, timeline, keywords) VALUES
(1, '（占位：城陵矶水文站退休职工）', '城陵矶水文站退休职工', '守护长江水文数据四十余载', '以前看数据，现在看变化', '/img/placeholder-person.jpg', '完整采访文字稿将在实地调研后填入。', '[{"year":"1980","event":"（待填）"},{"year":"2003","event":"（待填：三峡工程蓄水）"},{"year":"2015","event":"（待填）"},{"year":"2021","event":"（待填：长江十年禁渔启动）"}]', '["水文","城陵矶","水位"]'),
(2, '（占位：东洞庭湖湿地巡护员）', '东洞庭湖自然保护区巡护员', '用脚步丈量洞庭湖的生态变化', '鸟越来越多了，说明水质在变好', '/img/placeholder-person.jpg', '完整采访文字稿将在实地调研后填入。', '[{"year":"2010","event":"（待填：开始巡护工作）"},{"year":"2018","event":"（待填：洞庭湖环境整治）"}]', '["湿地","候鸟","巡护"]'),
(3, '（占位：退捕渔民）', '退捕渔民 · 江豚保护志愿者', '从捕鱼人到护鱼人', '以前打鱼，现在护鱼', '/img/placeholder-person.jpg', '完整采访文字稿将在实地调研后填入。', '[{"year":"1995","event":"（待填：开始打鱼）"},{"year":"2020","event":"（待填：响应禁渔政策上岸）"},{"year":"2021","event":"（待填：加入江豚保护协会）"}]', '["退捕","江豚","禁渔"]'),
(4, '（占位：沿江社区居民）', '岳阳沿江社区居民', '亲历了岸线从荒芜到公园的变迁', '以前江边都是砂石码头，现在变成了散步的公园', '/img/placeholder-person.jpg', '完整采访文字稿将在实地调研后填入。', '[{"year":"2000","event":"（待填）"},{"year":"2016","event":"（待填：共抓大保护提出）"},{"year":"2025","event":"（待填）"}]', '["社区","岸线","变迁"]'),
(5, '（占位：渔政执法人员）', '岳阳县渔政执法局工作人员', '常年巡护在洞庭湖水域一线', '现在每天巡护，非法捕捞越来越少', '/img/placeholder-person.jpg', '完整采访文字稿将在实地调研后填入。', '[{"year":"2019","event":"（待填）"},{"year":"2021","event":"（待填）"},{"year":"2024","event":"（待填）"}]', '["渔政","执法","巡护"]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO geo_points (id, name, lat, lng, description) VALUES
('hualong', '华龙码头（江豚湾）', 29.38, 113.00, '华龙码头曾是长江岸线上的砂石集散地，2016年整治后转型为江豚观测点。'),
('chenglingji', '城陵矶水文站', 29.43, 113.14, '城陵矶是洞庭湖汇入长江的唯一出口，水位数据对长江中下游防汛至关重要。'),
('dongting-wetland', '东洞庭湖湿地', 29.32, 112.98, '东洞庭湖国家级自然保护区，国际重要湿地。'),
('fishery', '渔政巡护水域', 29.35, 113.08, '岳阳县渔政执法船日常巡护水域。')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dashboard (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

INSERT INTO quiz (question, options, answer, explanation) VALUES
('长江十年禁渔从哪一年开始？', '["2018年","2020年","2021年","2023年"]', 2, '长江十年禁渔自2021年1月1日起正式实施。'),
('洞庭湖是中国的第几大淡水湖？', '["第一大","第二大","第三大","第四大"]', 1, '洞庭湖是中国第二大淡水湖，仅次于鄱阳湖。'),
('江豚被称为长江里的什么？', '["微笑天使","水中熊猫","长江之王","水中猎豹"]', 0, '长江江豚因嘴角上扬似微笑被称为微笑天使。'),
('下列哪种行为对洞庭湖生态有害？', '["植树造林","过度捕捞","污水处理","湿地保护"]', 1, '过度捕捞会破坏水域生态平衡。'),
('华龙码头现在被称为什么？', '["江豚湾","渔人码头","洞庭港","岳阳渡"]', 0, '华龙码头因常有江豚出没，被市民亲切地称为江豚湾。'),
('东洞庭湖是什么级别的自然保护区？', '["县级","市级","省级","国家级"]', 3, '东洞庭湖是国家级自然保护区。'),
('下列哪种鸟类不会来洞庭湖越冬？', '["白鹤","天鹅","企鹅","大雁"]', 2, '企鹅生活在南极，不会出现在洞庭湖。'),
('保护长江生态，我们可以做什么？', '["减少使用一次性塑料","向长江扔垃圾","购买非法渔获","破坏湿地植被"]', 0, '减少一次性塑料使用可以降低塑料垃圾进入水域的风险。'),
('洞庭湖的水最终流向哪里？', '["黄海","东海","南海","渤海"]', 1, '洞庭湖水经城陵矶汇入长江，最终流入东海。'),
('中国在2016年提出了什么长江保护理念？', '["共抓大保护，不搞大开发","先开发后保护","只保护不发展","全面禁航"]', 0, '2016年习近平总书记提出共抓大保护、不搞大开发的长江经济带发展理念。');
