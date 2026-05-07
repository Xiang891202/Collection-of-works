-- 自動更新 updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- 專案主表
CREATE TABLE IF NOT EXISTS projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  tag           TEXT NOT NULL,
  thumbnail_url TEXT,
  one_liner     TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'active',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_tag CHECK (tag IN ('商業專案', '練習專案')),
  CONSTRAINT chk_status CHECK (status IN ('active', 'deleted'))
);

CREATE TRIGGER update_projects_modtime
   BEFORE UPDATE ON projects
   FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 展示版內容（bander）
CREATE TABLE IF NOT EXISTS bander_content (
  project_id UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  data       JSONB NOT NULL
);

-- 專業版內容（founder）
CREATE TABLE IF NOT EXISTS founder_content (
  project_id UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  data       JSONB NOT NULL
);

-- 工程紀錄內容
CREATE TABLE IF NOT EXISTS case_study_content (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  version    INTEGER NOT NULL DEFAULT 1,
  data       JSONB NOT NULL,
  PRIMARY KEY (project_id, version)
);

-- 媒體庫
CREATE TABLE IF NOT EXISTS media (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID REFERENCES projects(id) ON DELETE SET NULL,
  type          TEXT,
  url           TEXT NOT NULL,
  description   TEXT,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 管理員帳號
CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'admin',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_tag ON projects(tag);
CREATE INDEX IF NOT EXISTS idx_media_project_id ON media(project_id);
CREATE INDEX IF NOT EXISTS idx_case_study_project_id ON case_study_content(project_id);