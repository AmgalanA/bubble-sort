CREATE DATABASE bubblesortdb;

CREATE SCHEMA number_values;

CREATE TABLE array_values(
    id SERIAL PRIMARY KEY,
    sorted_result integer[]
);
