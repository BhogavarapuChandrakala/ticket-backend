const pool = require('../db');

// Get all seats
exports.getSeats = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM seats ORDER BY seat_number');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Book seats (authenticated)
exports.bookSeats = async (req, res) => {
    const userId = req.user.userId;  // from JWT
    const { numberOfSeats } = req.body;

    if (!numberOfSeats || numberOfSeats < 1 || numberOfSeats > 7) {
        return res.status(400).json({ message: "You can book between 1 to 7 seats" });
    }

    try {
        // Get unbooked seats
        const result = await pool.query("SELECT * FROM seats WHERE is_booked = FALSE ORDER BY seat_number");
        const availableSeats = result.rows;

        if (availableSeats.length < numberOfSeats) {
            return res.status(400).json({ message: "Not enough available seats" });
        }

        // Group by rows
        const groupedByRow = {};
        for (const seat of availableSeats) {
            if (!groupedByRow[seat.row_number]) {
                groupedByRow[seat.row_number] = [];
            }
            groupedByRow[seat.row_number].push(seat);
        }

        let selectedSeats = [];

        // Priority: same row
        for (const row in groupedByRow) {
            if (groupedByRow[row].length >= numberOfSeats) {
                selectedSeats = groupedByRow[row].slice(0, numberOfSeats);
                break;
            }
        }

        // Fallback: closest available seats
        if (selectedSeats.length === 0) {
            selectedSeats = availableSeats.slice(0, numberOfSeats);
        }

        const seatIds = selectedSeats.map(seat => seat.id);

        await pool.query(
            'UPDATE seats SET is_booked = TRUE, user_id = $2 WHERE id = ANY($1::int[])',
            [seatIds, userId]
        );

        res.status(200).json({
            message: "Seats booked successfully",
            seats: selectedSeats.map(seat => seat.seat_number)
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Reset ONLY the current user's seats
exports.resetSeats = async (req, res) => {
    const userId = req.user.userId;
    try {
        const result = await pool.query(
            "UPDATE seats SET is_booked = FALSE, user_id = NULL WHERE user_id = $1 RETURNING seat_number",
            [userId]
        );
        res.status(200).json({
            message: "Your booked seats have been reset",
            cleared_seats: result.rows.map(row => row.seat_number)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
