-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

create table if not exists leaderboard (
  id uuid default gen_random_uuid() primary key,
  username text not null,
  completion_time bigint not null,   -- milliseconds
  wpm integer not null,
  accuracy integer not null,
  created_at timestamptz default now() not null
);

-- Index for fast sorted queries
create index if not exists leaderboard_time_idx on leaderboard (completion_time asc, wpm desc);

-- Enable Row Level Security
alter table leaderboard enable row level security;

-- Allow anyone to read
create policy "Public read" on leaderboard
  for select using (true);

-- Allow anyone to insert (unauthenticated players)
create policy "Public insert" on leaderboard
  for insert with check (true);

-- Enable Realtime
alter publication supabase_realtime add table leaderboard;
