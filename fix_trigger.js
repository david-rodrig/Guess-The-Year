import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres:ngr2PGX9mJ0o1wSs@db.ebvwwpvnasxngnvhyele.supabase.co:5432/postgres';

async function fix() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    
    await client.query(`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger AS $$
      BEGIN
        INSERT INTO public.profiles (id, full_name, avatar_url)
        VALUES (
          NEW.id,
          NEW.raw_user_meta_data->>'full_name',
          NEW.raw_user_meta_data->>'avatar_url'
        );
        INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
    `);
    
    console.log("Trigger function fixed!");
  } catch (e) {
    console.error("Fix failed:", e);
  } finally {
    await client.end();
  }
}

fix();
