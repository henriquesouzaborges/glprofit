# Security Specification & Test-Driven Security Design (TDD)

## 1. Data Invariants

1. **System User Identity & Privilege Protection**:
   - Only administrative members (`role == 'admin'`) can create, promote, or alter user roles and permissions.
   - Users cannot escalate their own privileges or modify immutable audit identifiers (`createdAt`, `id`).
   - Passwords and credentials must satisfy length bounds and cannot be modified by arbitrary unauthenticated callers.

2. **Student & Prontuário Integrity**:
   - Student records must have non-empty identifiers, valid status states (`ativo`, `inativo`, `pendente`, `bloqueado`), and cannot exceed 128 characters for names and emails.

3. **Financial Immutability & Auditability**:
   - Financial transactions require explicit types (`receita` or `despesa`), positive amounts, valid status states, and cannot be injected with ghost payload fields.

4. **Task & Team Collaboration Invariants**:
   - Tasks must belong to valid system members and enforce allowed priority levels (`baixa`, `media`, `alta`, `urgente`) and status flows.

5. **Access Log Non-Repudiation**:
   - Turnstile access logs are append-only audit trails; modifying past timestamps or altering log records is forbidden.

---

## 2. The "Dirty Dozen" Malicious Payloads

1. **Payload 1 (Privilege Escalation on User Creation)**:
   Attempting to create an admin user without administrative authorization.
   ```json
   { "id": "usr-hacker", "name": "Evil", "email": "evil@test.com", "role": "admin", "active": true, "permissions": ["all"] }
   ```

2. **Payload 2 (Shadow Field Injection in System Users)**:
   Injecting ghost arbitrary attributes (`__isAdmin: true`) into user doc.
   ```json
   { "id": "usr-1", "name": "Gianluca", "email": "g@test.com", "role": "admin", "active": true, "__isAdmin": true }
   ```

3. **Payload 3 (Financial Negative Value Poisoning)**:
   Attempting to inject a negative or zero transaction amount into finances.
   ```json
   { "id": "tx-bad", "type": "receita", "description": "Exploit", "amount": -9999, "status": "pago" }
   ```

4. **Payload 4 (Oversized ID Denial-of-Wallet)**:
   Attempting to pass an identifier string with 1500 characters.
   ```json
   { "id": "usr-A".repeat(1500), "name": "Spam", "email": "spam@test.com", "role": "recepcao", "active": true }
   ```

5. **Payload 5 (Illegal State Transition in Comandas)**:
   Changing a closed comanda directly back to arbitrary unapproved state.
   ```json
   { "id": "cmd-1", "status": "reopened_by_unauthorized", "total": 0 }
   ```

6. **Payload 6 (Student Impersonation & CPF Poisoning)**:
   Injecting invalid non-string formats into CPF and emergency contact.
   ```json
   { "id": "std-1", "name": "Aluno", "cpf": { "$malicious": true }, "status": "ativo" }
   ```

7. **Payload 7 (Unbounded Array Injection in Workouts)**:
   Injecting 50,000 array items into workouts exercises.
   ```json
   { "id": "wk-1", "studentId": "std-1", "title": "Bomb", "exercises": Array(50000).fill("spam") }
   ```

8. **Payload 8 (Attendance Tampering)**:
   Attempting to update an existing attendance log to forge past entry.
   ```json
   { "id": "log-1", "timestamp": "2020-01-01T00:00:00Z", "status": "presente" }
   ```

9. **Payload 9 (Stock Movement Ghost Adjustments)**:
   Injecting stock movements with negative quantities or empty product references.
   ```json
   { "id": "sm-1", "productId": "", "type": "saida", "quantity": -50, "date": "2026-10-13" }
   ```

10. **Payload 10 (Payment Link Expiry Manipulation)**:
    Updating payment links to spoof URL domains or bypass status checks.
    ```json
    { "id": "pl-1", "url": "javascript:alert(1)", "amount": 1, "status": "pago" }
    ```

11. **Payload 11 (Task Assignment to Non-Existent Member)**:
    Assigning task with invalid priority `'super_god_mode'` and corrupted fields.
    ```json
    { "id": "tsk-1", "title": "Test", "priority": "super_god_mode", "status": "pendente" }
    ```

12. **Payload 12 (System Settings Wiping / Overwrite)**:
    Non-admin user attempting to erase gym settings or inject arbitrary redirection URLs.
    ```json
    { "id": "setting-1", "gymName": "", "pixKey": "hacked-pix-key" }
    ```

---

## 3. Test Runner Specification (`firestore.rules.test.ts`)

The rules will enforce zero-trust evaluation:
- Unauthenticated writes fail.
- Non-admin modifications to protected administrative collections fail.
- Schemas without required fields fail.
- Any payload containing illegal extra fields or oversized strings fails.
