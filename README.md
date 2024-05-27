This is a simple Nextjs 14 auth templet to add authntication to your API

## Getting Started

First, clone the repo:

```bash
git clone https://github.com/flutterde/next-auth-kit
```

copy the .env.exaple

```bash
cp .env.example .env.local
```

add the required data to you .env

create this table in your Postgres database(this is a supabase database):

```SQL

create table
  public.users (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    email text not null,
    name text null,
    otp_code integer null,
    is_verified boolean null default false,
    password text not null,
    constraint users_pkey primary key (id),
    constraint users_email_key unique (email)
  ) tablespace pg_default;


create table
  public.verify_emails (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    email text not null,
    otp integer not null,
    user_id bigint null,
    constraint verify_emails_pkey primary key (id),
    constraint verify_emails_email_key unique (email),
    constraint verify_emails_user_id_fkey foreign key (user_id) references users (id) on delete cascade
  ) tablespace pg_default;


CREATE OR REPLACE FUNCTION public.insert_verify_email()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert a new row into verify_emails
    INSERT INTO public.verify_emails (email, otp, user_id)
    VALUES (NEW.email, NEW.otp_code, NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER after_user_insert
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.insert_verify_email();




CREATE OR REPLACE FUNCTION public.verify_email(p_email text, p_otp integer)
RETURNS TABLE(
    id bigint,
    created_at timestamp with time zone,
    email text,
    name text,
    is_verified boolean
) AS $$
DECLARE
    v_user_id bigint;
BEGIN
    -- Find the user_id associated with the provided email and OTP
    SELECT ve.user_id INTO v_user_id
    FROM public.verify_emails ve
    WHERE ve.email = p_email AND ve.otp = p_otp;

    -- If a matching row is found, update the user's is_verified and delete the row from verify_emails
    IF v_user_id IS NOT NULL THEN
        UPDATE public.users
        SET is_verified = true
        WHERE users.id = v_user_id;
        
        DELETE FROM public.verify_emails
        WHERE verify_emails.email = p_email AND verify_emails.otp = p_otp;
        
        -- Return the user row excluding the password column
        RETURN QUERY
        SELECT u.id, u.created_at, u.email, u.name, u.is_verified
        FROM public.users u
        WHERE u.id = v_user_id;
    ELSE
        -- Return an empty result set with the same structure if no user is found
        RETURN QUERY
        SELECT NULL::bigint, NULL::timestamp with time zone, NULL::text, NULL::text, NULL::boolean
        WHERE FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;



-- DROP FUNCTION verify_email(text,integer);



    -- test the Query
SELECT * FROM public.verify_email('user2@mail.com', 1235);

```

run the project

```bash
npm run dev
```
