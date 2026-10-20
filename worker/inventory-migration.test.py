"""Exercise real SQLite migration and paid-order inventory trigger."""
import json
import pathlib
import sqlite3
import unittest

ROOT = pathlib.Path(__file__).parent / 'migrations'


class InventoryMigrationTest(unittest.TestCase):
    def test_paid_orders_deduct_once_and_untracked_stock_stays_unknown(self):
        db = sqlite3.connect(':memory:')
        for migration in sorted(ROOT.glob('*.sql')):
            db.executescript(migration.read_text())
        db.execute("UPDATE products SET stock = 3 WHERE id = 'supple-oud'")
        items = json.dumps([{'id': 'supple-oud', 'quantity': 2}, {'id': 'mint-moss', 'quantity': 1}])
        db.execute("INSERT INTO orders (session_id, token_hash, amount, currency, items) VALUES (?, ?, ?, ?, ?)", ('cs_test_one', 'hash', 6600, 'usd', items))
        db.execute("UPDATE orders SET status = 'paid' WHERE session_id = 'cs_test_one'")
        db.execute("UPDATE orders SET status = 'paid' WHERE session_id = 'cs_test_one'")
        self.assertEqual(db.execute("SELECT stock FROM products WHERE id = 'supple-oud'").fetchone()[0], 1)
        self.assertIsNone(db.execute("SELECT stock FROM products WHERE id = 'mint-moss'").fetchone()[0])
        db.execute("INSERT INTO orders (session_id, token_hash, amount, currency, items) VALUES (?, ?, ?, ?, ?)", ('cs_test_two', 'hash2', 6600, 'usd', items))
        db.execute("UPDATE orders SET status = 'paid' WHERE session_id = 'cs_test_two'")
        self.assertEqual(db.execute("SELECT stock FROM products WHERE id = 'supple-oud'").fetchone()[0], -1)


if __name__ == '__main__':
    unittest.main()
