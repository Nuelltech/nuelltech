-- 1. Tabela de Sessões (Tráfego de entrada)
CREATE TABLE IF NOT EXISTS public.sessions (
    session_id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_agent TEXT,
    country TEXT,
    referrer TEXT,
    sector_selected TEXT
);

-- 2. Tabela de Visualização de Secções (Dwell Time por Montra)
CREATE TABLE IF NOT EXISTS public.section_views (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT REFERENCES public.sessions(session_id) ON DELETE CASCADE,
    section_id TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Interações / Cliques (Montras / Sandboxes)
CREATE TABLE IF NOT EXISTS public.clicks (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT REFERENCES public.sessions(session_id) ON DELETE CASCADE,
    element_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Transcrições de Conversas com o Vendedor (Chat Widget)
CREATE TABLE IF NOT EXISTS public.chat_logs (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT REFERENCES public.sessions(session_id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- 'user' ou 'nuell'
    message_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela de Conversões / Reuniões (Calendly Booking)
CREATE TABLE IF NOT EXISTS public.bookings (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT REFERENCES public.sessions(session_id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    event_time TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar o acesso público ou por chaves do cliente (Rls desativada ou configurada para simplicidade de escrita)
ALTER TABLE public.sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
