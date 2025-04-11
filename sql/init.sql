CREATE TABLE IF NOT EXISTS seats (
    id SERIAL PRIMARY KEY,
    seat_number INT UNIQUE NOT NULL,
    row_number INT NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE
);

-- Insert 80 seats
DO $$
DECLARE
    i INT := 1;
BEGIN
    WHILE i <= 80 LOOP
        INSERT INTO seats (seat_number, row_number)
        VALUES (i, CASE
            WHEN i <= 77 THEN CEIL(i / 7.0)::INT
            ELSE 12
        END);
        i := i + 1;
    END LOOP;
END $$;
