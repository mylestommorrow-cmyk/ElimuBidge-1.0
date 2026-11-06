CREATE TABLE public.ai_request_windows (user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE, window_start timestamptz NOT NULL DEFAULT now(), request_count integer NOT NULL DEFAULT 0);
GRANT SELECT ON public.ai_request_windows TO authenticated;
GRANT ALL ON public.ai_request_windows TO service_role;
ALTER TABLE public.ai_request_windows ENABLE ROW LEVEL SECURITY;
CREATE POLICY ai_window_read_own ON public.ai_request_windows FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE FUNCTION public.consume_ai_request() RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ DECLARE allowed boolean; BEGIN IF auth.uid() IS NULL THEN RETURN false; END IF; INSERT INTO public.ai_request_windows (user_id,window_start,request_count) VALUES(auth.uid(),now(),1) ON CONFLICT (user_id) DO UPDATE SET request_count = CASE WHEN ai_request_windows.window_start < now() - interval '1 minute' THEN 1 ELSE ai_request_windows.request_count + 1 END, window_start = CASE WHEN ai_request_windows.window_start < now() - interval '1 minute' THEN now() ELSE ai_request_windows.window_start END RETURNING request_count <= 25 INTO allowed; RETURN allowed; END; $$;
REVOKE EXECUTE ON FUNCTION public.consume_ai_request() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.consume_ai_request() TO authenticated;