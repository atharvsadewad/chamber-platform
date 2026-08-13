function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  indianKanoonApiKey:
    process.env.INDIAN_KANOON_API_KEY ?? "",

  geminiApiKey:
    process.env.GEMINI_API_KEY ?? "",

  supabaseUrl:
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",

  supabaseAnonKey:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};

export { required };