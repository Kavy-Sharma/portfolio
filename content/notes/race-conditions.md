---
title: "Race Conditions"
symbol: "Rc"
category: "Logic"
readTime: 2
tldr: "Sending multiple requests in parallel exploits the timing window between checking a balance and deducting it."
red: "Send simultaneous requests with tools like Turbo Intruder to redeem a single-use coupon or gift card multiple times."
blue: "Use database transactions with row-level locks or mutexes to ensure balance updates are strictly atomic."
next: "tcp-vs-udp"
---

### What is a Race Condition?
A Race Condition occurs when multiple concurrent execution threads access and modify shared resources without proper synchronization. In web applications, this frequently takes the form of a **Time-of-Check to Time-of-Use (TOCTOU)** flaw.

The application first checks: "Is this coupon valid?" If yes, it proceeds to apply the discount, and only then marks the coupon as used. If an attacker sends twenty requests in the exact same millisecond, all twenty requests pass the check before any of them updates the database.

### How it looks in practice
Consider a coupon redemption endpoint:

```python
# Vulnerable sequence
def apply_coupon(user, coupon_code):
    coupon = db.get_coupon(coupon_code)
    if not coupon.is_used:                 # 1. Check
        user.apply_discount(coupon.value)  # 2. Use
        coupon.is_used = True              # 3. Update status
        db.save(coupon)
```

If an attacker sends 30 simultaneous requests using Burp Suite's Turbo Intruder:
1. All 30 requests hit Step 1 simultaneously.
2. For all 30 threads, `coupon.is_used` is still `False`.
3. All 30 threads execute Step 2, granting 30 discounts.
4. Finally, Step 3 executes, but the damage is already done.

The attacker successfully applies a single-use $20 coupon 30 times, reducing an expensive cart balance to zero.

### Other common targets
- Withdrawing funds from account balances.
- Voting systems where a user is limited to one vote per poll.
- Claiming limited inventory items during flash sales.

### How to defend against it
1. **Atomic database operations**: Ensure check-and-update occurs in a single atomic SQL statement:
   ```sql
   UPDATE coupons SET is_used = TRUE WHERE code = ? AND is_used = FALSE;
   ```
   If zero rows were affected, the coupon has already been claimed.
2. **Pessimistic locking**: Wrap operations in database transactions with row-level locks (`SELECT ... FOR UPDATE`).
