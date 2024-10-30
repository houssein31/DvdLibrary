--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Homebrew)
-- Dumped by pg_dump version 14.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: rating; Type: TYPE; Schema: public; Owner: housseinkharroubi
--

CREATE TYPE public.rating AS ENUM (
    'G',
    'PG',
    'PG-13',
    'R',
    'NC-17'
);


ALTER TYPE public.rating OWNER TO housseinkharroubi;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: dvd; Type: TABLE; Schema: public; Owner: housseinkharroubi
--

CREATE TABLE public.dvd (
    dvd_id integer NOT NULL,
    dvd_title character varying(255) NOT NULL,
    release_year character varying(4),
    director character varying(255),
    note character varying(255),
    dvd_rating character varying(255)
);


ALTER TABLE public.dvd OWNER TO housseinkharroubi;

--
-- Name: dvd_dvd_id_seq; Type: SEQUENCE; Schema: public; Owner: housseinkharroubi
--

CREATE SEQUENCE public.dvd_dvd_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dvd_dvd_id_seq OWNER TO housseinkharroubi;

--
-- Name: dvd_dvd_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: housseinkharroubi
--

ALTER SEQUENCE public.dvd_dvd_id_seq OWNED BY public.dvd.dvd_id;


--
-- Name: dvd dvd_id; Type: DEFAULT; Schema: public; Owner: housseinkharroubi
--

ALTER TABLE ONLY public.dvd ALTER COLUMN dvd_id SET DEFAULT nextval('public.dvd_dvd_id_seq'::regclass);


--
-- Data for Name: dvd; Type: TABLE DATA; Schema: public; Owner: housseinkharroubi
--

COPY public.dvd (dvd_id, dvd_title, release_year, director, note, dvd_rating) FROM stdin;
2	The Dark Knight	2008	Christopher Nolan	This is a masterpiece	PG13
4	Monsters Inc	2001	Pete Docter	Fire kids movie	G
5	Freaky Friday	2003	Mark Waters	Not a bad movie	G
1	Inception	2010	Christopher Nolan	This is a great movie	PG13
\.


--
-- Name: dvd_dvd_id_seq; Type: SEQUENCE SET; Schema: public; Owner: housseinkharroubi
--

SELECT pg_catalog.setval('public.dvd_dvd_id_seq', 9, true);


--
-- Name: dvd dvd_pkey; Type: CONSTRAINT; Schema: public; Owner: housseinkharroubi
--

ALTER TABLE ONLY public.dvd
    ADD CONSTRAINT dvd_pkey PRIMARY KEY (dvd_id);


--
-- PostgreSQL database dump complete
--

