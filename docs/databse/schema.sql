-- =========================================================================
-- SISTEMA DE GESTIÓN PARA GUARDERÍA INFANTIL - MySQL 8.0+
-- Versión: 2.0 Mejorada
-- Autores: Julian David Bolivar Agudelo, Juan Manuel Morales Santacruz
-- =========================================================================

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- ========================= 
-- USUARIOS / RBAC
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    phone VARCHAR(40),
    password_hash VARCHAR(255) NOT NULL,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_users_status (status, deleted_at),
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(80) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_roles_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(80) NOT NULL UNIQUE,
    description VARCHAR(160),
    module VARCHAR(40) COMMENT 'Agrupación por módulo del sistema',
    INDEX idx_permissions_module (module)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by BIGINT UNSIGNED,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- AULAS / PERSONAL
-- =========================
CREATE TABLE IF NOT EXISTS classrooms (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    capacity INT UNSIGNED NOT NULL,
    age_min_months INT UNSIGNED NOT NULL,
    age_max_months INT UNSIGNED NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_capacity CHECK (capacity > 0),
    CONSTRAINT chk_age_range CHECK (age_min_months < age_max_months),
    INDEX idx_classrooms_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS staff (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    document VARCHAR(40) NOT NULL UNIQUE,
    specific_role ENUM('educator','assistant','admin','accounting') NOT NULL,
    shift_notes VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_staff_role (specific_role, active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS classroom_staff (
    classroom_id BIGINT UNSIGNED NOT NULL,
    staff_id BIGINT UNSIGNED NOT NULL,
    role_in_class ENUM('lead','support') NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by BIGINT UNSIGNED,
    PRIMARY KEY (classroom_id, staff_id),
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- HORARIOS Y FESTIVOS
-- =========================
CREATE TABLE IF NOT EXISTS schedules (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    day_of_week TINYINT UNSIGNED NOT NULL COMMENT '1=Lunes, 7=Domingo',
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_day_of_week CHECK (day_of_week BETWEEN 1 AND 7),
    CONSTRAINT chk_time_range CHECK (start_time < end_time),
    CONSTRAINT uq_schedule UNIQUE (name, day_of_week, start_time, end_time),
    INDEX idx_schedules_active (active, day_of_week)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- NUEVA: Asignación detallada de horarios al personal
CREATE TABLE IF NOT EXISTS staff_schedules (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    staff_id BIGINT UNSIGNED NOT NULL,
    schedule_id BIGINT UNSIGNED NOT NULL,
    effective_from DATE NOT NULL,
    effective_until DATE,
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT uq_staff_schedule UNIQUE (staff_id, schedule_id, effective_from),
    INDEX idx_staff_schedules_dates (staff_id, effective_from, effective_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS holidays (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    holiday_date DATE NOT NULL UNIQUE,
    description VARCHAR(120),
    affects_billing BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_holidays_date (holiday_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- FAMILIAS / TUTORES / NIÑOS
-- =========================
CREATE TABLE IF NOT EXISTS families (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(40) UNIQUE,
    contact_email VARCHAR(160),
    contact_phone VARCHAR(40),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_families_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS guardians (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    document VARCHAR(40) NOT NULL UNIQUE,
    relationship VARCHAR(40),
    phone VARCHAR(40),
    email VARCHAR(160),
    family_id BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (family_id) REFERENCES families(id) ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_guardians_family (family_id),
    INDEX idx_guardians_document (document)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS children (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    document VARCHAR(40) UNIQUE,
    birth_date DATE NOT NULL,
    classroom_id BIGINT UNSIGNED,
    family_id BIGINT UNSIGNED,
    medical_info TEXT,
    medical_notes TEXT COMMENT 'Notas médicas adicionales',
    special_permissions TEXT COMMENT 'Permisos especiales (RF-004)',
    emergency_contact_name VARCHAR(120),
    emergency_contact_phone VARCHAR(40),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (family_id) REFERENCES families(id) ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_children_family (family_id, active),
    INDEX idx_children_classroom (classroom_id, active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS child_guardians (
    child_id BIGINT UNSIGNED NOT NULL,
    guardian_id BIGINT UNSIGNED NOT NULL,
    pickup_authorized BOOLEAN DEFAULT TRUE,
    relationship_notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (child_id, guardian_id),
    FOREIGN KEY (child_id) REFERENCES children(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (guardian_id) REFERENCES guardians(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- ALERGIAS / MENÚS
-- =========================
CREATE TABLE IF NOT EXISTS allergies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    description VARCHAR(255),
    severity ENUM('mild','moderate','severe') DEFAULT 'moderate',
    INDEX idx_allergies_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS child_allergies (
    child_id BIGINT UNSIGNED NOT NULL,
    allergy_id BIGINT UNSIGNED NOT NULL,
    diagnosed_date DATE,
    notes TEXT,
    PRIMARY KEY (child_id, allergy_id),
    FOREIGN KEY (child_id) REFERENCES children(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (allergy_id) REFERENCES allergies(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS menus (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    menu_date DATE NOT NULL UNIQUE,
    description VARCHAR(255),
    published BOOLEAN DEFAULT FALSE,
    created_by BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_menus_date (menu_date, published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS menu_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    menu_id BIGINT UNSIGNED NOT NULL,
    item_name VARCHAR(120) NOT NULL,
    meal_type ENUM('breakfast','morning_snack','lunch','afternoon_snack','dinner') NOT NULL,
    ingredients TEXT,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON UPDATE CASCADE ON DELETE CASCADE,
    INDEX idx_menu_items_menu (menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS menu_item_allergy_flags (
    menu_item_id BIGINT UNSIGNED NOT NULL,
    allergy_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (menu_item_id, allergy_id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (allergy_id) REFERENCES allergies(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- PLAN SEMANAL / ACTIVIDADES
-- =========================
CREATE TABLE IF NOT EXISTS weekly_plans (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    classroom_id BIGINT UNSIGNED NOT NULL,
    week_start DATE NOT NULL COMMENT 'Lunes de la semana',
    status ENUM('draft','published') DEFAULT 'draft',
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT uq_weekly_plan UNIQUE (classroom_id, week_start),
    INDEX idx_weekly_plans_status (status, week_start)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS activities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    weekly_plan_id BIGINT UNSIGNED NOT NULL,
    activity_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    title VARCHAR(120) NOT NULL,
    description TEXT,
    materials TEXT,
    responsible_staff_id BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (weekly_plan_id) REFERENCES weekly_plans(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (responsible_staff_id) REFERENCES staff(id) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT chk_activity_time CHECK (start_time < end_time),
    INDEX idx_activities_date (activity_date, start_time, end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- ASISTENCIA / COMPORTAMIENTO
-- =========================
CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    child_id BIGINT UNSIGNED NOT NULL,
    att_date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status ENUM('present','absent','late','left_early') NOT NULL,
    origin ENUM('manual','automatic') NOT NULL,
    justification VARCHAR(255),
    is_within_schedule BOOLEAN DEFAULT TRUE COMMENT 'R-001: Control de horario',
    override_reason VARCHAR(255) COMMENT 'Razón si está fuera de horario',
    recorded_by_user BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (recorded_by_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_attendance_child_date (child_id, att_date),
    INDEX idx_attendance_date (att_date),
    INDEX idx_attendance_status (status, att_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS behavior_notes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    child_id BIGINT UNSIGNED NOT NULL,
    note_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    severity ENUM('info','positive','warning','critical') DEFAULT 'info',
    note TEXT NOT NULL,
    action_taken TEXT,
    parent_notified BOOLEAN DEFAULT FALSE,
    created_by_user BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (child_id) REFERENCES children(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (created_by_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_behavior_notes_child_date (child_id, note_date),
    INDEX idx_behavior_notes_severity (severity, note_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- EVENTOS
-- =========================
CREATE TABLE IF NOT EXISTS events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(160),
    capacity INT UNSIGNED,
    requires_permission BOOLEAN DEFAULT FALSE,
    status ENUM('draft','published','closed') DEFAULT 'draft',
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_event_time CHECK (start_time < end_time),
    INDEX idx_events_date (event_date, status),
    INDEX idx_events_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS event_registrations (
    event_id BIGINT UNSIGNED NOT NULL,
    child_id BIGINT UNSIGNED NOT NULL,
    status ENUM('registered','waitlist','cancelled') DEFAULT 'registered',
    registered_by BIGINT UNSIGNED COMMENT 'Tutor que registró',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP NULL,
    PRIMARY KEY (event_id, child_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES children(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (registered_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_event_registrations_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- REUNIONES (RF-013) - NUEVA TABLA
-- =========================
CREATE TABLE IF NOT EXISTS meetings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    educator_id BIGINT UNSIGNED NOT NULL,
    guardian_id BIGINT UNSIGNED NOT NULL,
    child_id BIGINT UNSIGNED COMMENT 'Niño relacionado a la reunión',
    meeting_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('scheduled','confirmed','cancelled','completed') DEFAULT 'scheduled',
    topic VARCHAR(255),
    notes TEXT,
    created_by BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (educator_id) REFERENCES staff(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (guardian_id) REFERENCES guardians(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES children(id) ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT chk_meeting_time CHECK (start_time < end_time),
    CONSTRAINT uq_meeting UNIQUE (educator_id, meeting_date, start_time),
    INDEX idx_meetings_educator (educator_id, meeting_date),
    INDEX idx_meetings_guardian (guardian_id, meeting_date),
    INDEX idx_meetings_status (status, meeting_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- NOTIFICACIONES (RF-012, RF-018) - MEJORADA
-- =========================
CREATE TABLE IF NOT EXISTS notification_preferences (
    user_id BIGINT UNSIGNED NOT NULL,
    channel ENUM('email','push','sms','inapp') NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, channel),
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    to_user_id BIGINT UNSIGNED NOT NULL,
    channel ENUM('email','push','sms','inapp') NOT NULL,
    notif_type ENUM('health_alert','behavior_alert','food_alert','payment_reminder','event_announcement','schedule_change','general') NOT NULL,
    subject VARCHAR(160),
    body TEXT,
    sent_at TIMESTAMP NULL,
    read_at TIMESTAMP NULL COMMENT 'RF-018: Confirmación de lectura',
    confirmed_at TIMESTAMP NULL COMMENT 'RF-018: Confirmación explícita',
    requires_confirmation BOOLEAN DEFAULT FALSE COMMENT 'RF-018: Requiere confirmación',
    status ENUM('queued','sent','failed','read','confirmed') DEFAULT 'queued',
    error_message TEXT,
    related_entity_type VARCHAR(40) COMMENT 'Tipo de entidad relacionada',
    related_entity_id BIGINT UNSIGNED COMMENT 'ID de entidad relacionada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    INDEX idx_notifications_status (status, channel, sent_at),
    INDEX idx_notifications_user_read (to_user_id, read_at),
    INDEX idx_notifications_type (notif_type, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- DOCUMENTOS
-- =========================
CREATE TABLE IF NOT EXISTS documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    owner_type ENUM('child','family','invoice','user','general') NOT NULL,
    owner_id BIGINT UNSIGNED NOT NULL COMMENT 'Polimórfico - validar en aplicación',
    file_name VARCHAR(160) NOT NULL,
    mime_type VARCHAR(80) NOT NULL,
    size_bytes INT UNSIGNED NOT NULL,
    storage_url VARCHAR(255) NOT NULL,
    document_type VARCHAR(40) COMMENT 'Tipo específico: certificado, autorización, etc.',
    uploaded_by BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT chk_document_size CHECK (size_bytes <= 10485760),
    INDEX idx_documents_owner (owner_type, owner_id),
    INDEX idx_documents_type (document_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- PAGOS / FACTURACIÓN
-- =========================
CREATE TABLE IF NOT EXISTS invoices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    family_id BIGINT UNSIGNED NOT NULL,
    invoice_number VARCHAR(40) NOT NULL UNIQUE,
    issue_date DATE NOT NULL,
    due_date DATE,
    total DECIMAL(12,2) NOT NULL,
    status ENUM('pending','processing','paid','cancelled') DEFAULT 'pending',
    concept VARCHAR(160) COMMENT 'Mensualidad, inscripción, servicio adicional',
    pdf_url VARCHAR(255),
    is_adjustment BOOLEAN DEFAULT FALSE COMMENT 'R-004: Indica si es nota de crédito/ajuste',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_invoice_total CHECK (total > 0),
    INDEX idx_invoices_family_status (family_id, status),
    INDEX idx_invoices_date (issue_date DESC),
    INDEX idx_invoices_number (invoice_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- NUEVA: Ajustes/Notas de crédito (R-004)
CREATE TABLE IF NOT EXISTS invoice_adjustments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    original_invoice_id BIGINT UNSIGNED NOT NULL,
    adjustment_invoice_id BIGINT UNSIGNED NOT NULL,
    reason VARCHAR(255) NOT NULL,
    created_by BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (original_invoice_id) REFERENCES invoices(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (adjustment_invoice_id) REFERENCES invoices(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_adjustments_original (original_invoice_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT UNSIGNED NOT NULL,
    method ENUM('gateway','manual') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    paid_at TIMESTAMP NULL,
    status ENUM('initiated','approved','rejected') DEFAULT 'initiated',
    receipt_number VARCHAR(40) COMMENT 'Número de comprobante para pagos manuales',
    notes TEXT COMMENT 'Notas adicionales para pagos manuales',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT chk_payment_amount CHECK (amount > 0),
    INDEX idx_payments_invoice (invoice_id, status),
    INDEX idx_payments_status (status, paid_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payment_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT UNSIGNED NOT NULL,
    external_tx_id VARCHAR(80) NOT NULL UNIQUE,
    gateway VARCHAR(40) COMMENT 'wompi, epayco, etc.',
    raw_payload JSON COMMENT 'Respuesta completa de la pasarela',
    status VARCHAR(32),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON UPDATE CASCADE ON DELETE CASCADE,
    INDEX idx_payment_tx_external (external_tx_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- CHATBOT / AUDITORÍA
-- =========================
CREATE TABLE IF NOT EXISTS chatbot_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL,
    user_id BIGINT UNSIGNED COMMENT 'Usuario autenticado o null si visitante',
    user_role ENUM('user','assistant','system') NOT NULL,
    message TEXT NOT NULL,
    intent VARCHAR(80) COMMENT 'Intención detectada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_chatbot_session (session_id, created_at),
    INDEX idx_chatbot_user (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    actor_user_id BIGINT UNSIGNED,
    entity VARCHAR(64) NOT NULL COMMENT 'Nombre de la tabla afectada',
    entity_id BIGINT UNSIGNED NOT NULL,
    action VARCHAR(32) NOT NULL COMMENT 'CREATE, UPDATE, DELETE, etc.',
    before_json JSON COMMENT 'Estado anterior del registro',
    after_json JSON COMMENT 'Estado posterior del registro',
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actor_user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_audit_entity (entity, entity_id),
    INDEX idx_audit_actor (actor_user_id, created_at),
    INDEX idx_audit_action (action, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- VISTAS ÚTILES
-- =========================

-- Vista: Resumen de niños con información consolidada
CREATE OR REPLACE VIEW v_child_summary AS
SELECT 
    c.id AS child_id,
    c.full_name,
    c.birth_date,
    TIMESTAMPDIFF(MONTH, c.birth_date, CURDATE()) AS age_months,
    c.classroom_id,
    cl.name AS classroom_name,
    c.family_id,
    f.code AS family_code,
    f.contact_email AS family_email,
    c.active,
    (SELECT COUNT(*)
     FROM child_guardians cg 
     WHERE cg.child_id = c.id AND cg.pickup_authorized = TRUE
    ) AS authorized_guardians_count,
    (SELECT COUNT(*)
     FROM child_allergies ca
     WHERE ca.child_id = c.id
    ) AS allergies_count
FROM children c
LEFT JOIN classrooms cl ON cl.id = c.classroom_id
LEFT JOIN families f ON f.id = c.family_id;

-- Vista: Estado de facturas con totales
CREATE OR REPLACE VIEW v_invoice_status AS
SELECT 
    i.id,
    i.invoice_number,
    i.family_id,
    f.code AS family_code,
    f.contact_email,
    i.issue_date,
    i.due_date,
    i.status,
    i.total,
    COALESCE(
        (SELECT SUM(p.amount) 
         FROM payments p 
         WHERE p.invoice_id = i.id AND p.status = 'approved'
        ), 0
    ) AS total_paid,
    i.total - COALESCE(
        (SELECT SUM(p.amount) 
         FROM payments p 
         WHERE p.invoice_id = i.id AND p.status = 'approved'
        ), 0
    ) AS balance_due,
    CASE 
        WHEN i.status = 'paid' THEN 'Pagada'
        WHEN COALESCE(
            (SELECT SUM(p.amount) 
             FROM payments p 
             WHERE p.invoice_id = i.id AND p.status = 'approved'
            ), 0
        ) >= i.total THEN 'Pagada Completa'
        WHEN COALESCE(
            (SELECT SUM(p.amount) 
             FROM payments p 
             WHERE p.invoice_id = i.id AND p.status = 'approved'
            ), 0
        ) > 0 THEN 'Pago Parcial'
        ELSE 'Pendiente'
    END AS payment_status
FROM invoices i
LEFT JOIN families f ON f.id = i.family_id;

-- Vista: Resumen de asistencia mensual por niño
CREATE OR REPLACE VIEW v_attendance_summary AS
SELECT 
    c.id AS child_id,
    c.full_name,
    c.classroom_id,
    cl.name AS classroom_name,
    DATE_FORMAT(a.att_date, '%Y-%m') AS month,
    COUNT(*) AS total_days,
    SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS days_present,
    SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS days_absent,
    SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) AS days_late,
    SUM(CASE WHEN a.status = 'left_early' THEN 1 ELSE 0 END) AS days_left_early,
    ROUND(
        (SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100.0) / COUNT(*), 
        2
    ) AS attendance_percentage
FROM children c
LEFT JOIN attendance a ON a.child_id = c.id
LEFT JOIN classrooms cl ON cl.id = c.classroom_id
WHERE c.active = TRUE
GROUP BY c.id, c.full_name, c.classroom_id, cl.name, DATE_FORMAT(a.att_date, '%Y-%m');

-- Vista: Calendario de educadores (disponibilidad)
CREATE OR REPLACE VIEW v_educator_availability AS
SELECT 
    s.id AS staff_id,
    u.name AS educator_name,
    s.specific_role,
    sch.day_of_week,
    CASE sch.day_of_week
        WHEN 1 THEN 'Lunes'
        WHEN 2 THEN 'Martes'
        WHEN 3 THEN 'Miércoles'
        WHEN 4 THEN 'Jueves'
        WHEN 5 THEN 'Viernes'
        WHEN 6 THEN 'Sábado'
        WHEN 7 THEN 'Domingo'
    END AS day_name,
    sch.start_time,
    sch.end_time,
    ss.effective_from,
    ss.effective_until,
    CASE 
        WHEN ss.effective_until IS NULL OR ss.effective_until >= CURDATE() 
        THEN 'Activo'
        ELSE 'Inactivo'
    END AS status
FROM staff s
INNER JOIN users u ON u.id = s.user_id
LEFT JOIN staff_schedules ss ON ss.staff_id = s.id
LEFT JOIN schedules sch ON sch.id = ss.schedule_id
WHERE s.active = TRUE;

-- Vista: Menús con alertas de alergias
CREATE OR REPLACE VIEW v_menu_allergy_alerts AS
SELECT 
    m.id AS menu_id,
    m.menu_date,
    mi.id AS menu_item_id,
    mi.item_name,
    mi.meal_type,
    a.name AS allergy_name,
    a.severity,
    COUNT(DISTINCT ca.child_id) AS affected_children_count
FROM menus m
INNER JOIN menu_items mi ON mi.menu_id = m.id
INNER JOIN menu_item_allergy_flags miaf ON miaf.menu_item_id = mi.id
INNER JOIN allergies a ON a.id = miaf.allergy_id
LEFT JOIN child_allergies ca ON ca.allergy_id = a.id
WHERE m.published = TRUE
GROUP BY m.id, m.menu_date, mi.id, mi.item_name, mi.meal_type, a.name, a.severity;

-- Vista: Ocupación de aulas
CREATE OR REPLACE VIEW v_classroom_occupancy AS
SELECT 
    cl.id AS classroom_id,
    cl.name AS classroom_name,
    cl.capacity,
    cl.age_min_months,
    cl.age_max_months,
    COUNT(c.id) AS current_children,
    cl.capacity - COUNT(c.id) AS available_spots,
    ROUND((COUNT(c.id) * 100.0) / cl.capacity, 2) AS occupancy_percentage,
    (SELECT COUNT(*)
     FROM classroom_staff cs
     WHERE cs.classroom_id = cl.id
    ) AS assigned_staff
FROM classrooms cl
LEFT JOIN children c ON c.classroom_id = cl.id AND c.active = TRUE
WHERE cl.active = TRUE
GROUP BY cl.id, cl.name, cl.capacity, cl.age_min_months, cl.age_max_months;

-- Vista: Próximas reuniones
CREATE OR REPLACE VIEW v_upcoming_meetings AS
SELECT 
    m.id AS meeting_id,
    m.meeting_date,
    m.start_time,
    m.end_time,
    m.status,
    s.id AS educator_id,
    u_edu.name AS educator_name,
    g.id AS guardian_id,
    g.full_name AS guardian_name,
    c.id AS child_id,
    c.full_name AS child_name,
    m.topic,
    DATEDIFF(m.meeting_date, CURDATE()) AS days_until_meeting
FROM meetings m
INNER JOIN staff s ON s.id = m.educator_id
INNER JOIN users u_edu ON u_edu.id = s.user_id
INNER JOIN guardians g ON g.id = m.guardian_id
LEFT JOIN children c ON c.id = m.child_id
WHERE m.status IN ('scheduled', 'confirmed')
  AND m.meeting_date >= CURDATE()
ORDER BY m.meeting_date, m.start_time;

-- =========================
-- DATOS INICIALES (SEED DATA)
-- =========================

-- Roles básicos del sistema
INSERT INTO roles (code, name, description) VALUES
('ADMIN', 'Administrador', 'Acceso completo al sistema'),
('EDUCATOR', 'Educador', 'Gestión de aulas, actividades y asistencia'),
('ACCOUNTING', 'Contabilidad', 'Gestión de pagos y facturación'),
('PARENT', 'Padre/Tutor', 'Acceso al portal de padres'),
('SUPPORT', 'Soporte Técnico', 'Soporte y mantenimiento del sistema')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Permisos por módulo
INSERT INTO permissions (code, description, module) VALUES
-- Administración
('admin.staff.create', 'Crear personal', 'administration'),
('admin.staff.read', 'Consultar personal', 'administration'),
('admin.staff.update', 'Editar personal', 'administration'),
('admin.staff.delete', 'Desactivar personal', 'administration'),
('admin.classroom.manage', 'Gestionar aulas', 'administration'),
('admin.schedule.manage', 'Gestionar horarios', 'administration'),
('admin.rbac.manage', 'Gestionar roles y permisos', 'administration'),

-- Niños y Tutores
('children.create', 'Crear perfil de niño', 'children'),
('children.read', 'Consultar perfil de niño', 'children'),
('children.update', 'Editar perfil de niño', 'children'),
('children.guardians.manage', 'Gestionar tutores autorizados', 'children'),
('children.documents.manage', 'Gestionar documentos de niños', 'children'),

-- Asistencia
('attendance.register', 'Registrar asistencia', 'attendance'),
('attendance.view', 'Ver asistencia', 'attendance'),
('attendance.reports', 'Generar reportes de asistencia', 'attendance'),
('behavior.register', 'Registrar observaciones de comportamiento', 'attendance'),

-- Actividades
('activities.create', 'Crear actividades', 'activities'),
('activities.update', 'Editar actividades', 'activities'),
('activities.publish', 'Publicar plan semanal', 'activities'),
('menus.manage', 'Gestionar menús', 'activities'),
('events.manage', 'Gestionar eventos', 'activities'),

-- Padres
('portal.view_child', 'Ver información del hijo', 'portal'),
('portal.meetings.request', 'Solicitar reuniones', 'portal'),
('portal.documents.download', 'Descargar documentos', 'portal'),
('portal.events.register', 'Inscribir a eventos', 'portal'),

-- Pagos
('payments.create_invoice', 'Generar facturas', 'payments'),
('payments.register', 'Registrar pagos', 'payments'),
('payments.view', 'Consultar pagos', 'payments'),
('payments.reports', 'Generar reportes financieros', 'payments'),

-- Notificaciones
('notifications.send', 'Enviar notificaciones', 'notifications'),
('notifications.view', 'Ver notificaciones', 'notifications')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Asignación de permisos a roles (RBAC básico)
-- ADMIN: Todos los permisos
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'ADMIN'
ON DUPLICATE KEY UPDATE role_id=VALUES(role_id);

-- EDUCATOR: Permisos operativos
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'EDUCATOR'
  AND p.code IN (
    'children.read', 'children.update', 'children.guardians.manage',
    'attendance.register', 'attendance.view', 'attendance.reports',
    'behavior.register',
    'activities.create', 'activities.update', 'activities.publish',
    'menus.manage', 'events.manage',
    'notifications.send', 'notifications.view'
  )
ON DUPLICATE KEY UPDATE role_id=VALUES(role_id);

-- ACCOUNTING: Permisos financieros
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'ACCOUNTING'
  AND p.code LIKE 'payments.%'
ON DUPLICATE KEY UPDATE role_id=VALUES(role_id);

-- PARENT: Permisos del portal
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'PARENT'
  AND (p.code LIKE 'portal.%' OR p.code = 'payments.view')
ON DUPLICATE KEY UPDATE role_id=VALUES(role_id);

-- Alergias comunes
INSERT INTO allergies (name, description, severity) VALUES
('Leche', 'Alergia a productos lácteos', 'moderate'),
('Huevo', 'Alergia al huevo', 'moderate'),
('Maní', 'Alergia al maní y frutos secos', 'severe'),
('Trigo', 'Alergia al gluten/trigo', 'moderate'),
('Soja', 'Alergia a la soja', 'moderate'),
('Pescado', 'Alergia a pescados y mariscos', 'severe'),
('Frutos secos', 'Alergia a nueces y almendras', 'severe'),
('Abejas', 'Alergia a picaduras de abeja', 'critical')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Horarios estándar (Ejemplo: Lunes a Viernes 6:00-18:00)
INSERT INTO schedules (name, day_of_week, start_time, end_time, active) VALUES
('Horario Estándar', 1, '06:00:00', '18:00:00', TRUE),
('Horario Estándar', 2, '06:00:00', '18:00:00', TRUE),
('Horario Estándar', 3, '06:00:00', '18:00:00', TRUE),
('Horario Estándar', 4, '06:00:00', '18:00:00', TRUE),
('Horario Estándar', 5, '06:00:00', '18:00:00', TRUE)
ON DUPLICATE KEY UPDATE active=VALUES(active);

-- =========================
-- TRIGGERS DE AUDITORÍA
-- =========================

-- Trigger: Auditar cambios en usuarios
DELIMITER $

CREATE TRIGGER trg_audit_users_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status OR OLD.mfa_enabled != NEW.mfa_enabled THEN
        INSERT INTO audit_logs (actor_user_id, entity, entity_id, action, before_json, after_json)
        VALUES (
            NEW.id,
            'users',
            NEW.id,
            'UPDATE',
            JSON_OBJECT(
                'status', OLD.status,
                'mfa_enabled', OLD.mfa_enabled
            ),
            JSON_OBJECT(
                'status', NEW.status,
                'mfa_enabled', NEW.mfa_enabled
            )
        );
    END IF;
END$

-- Trigger: Auditar cambios en facturas (R-004: Inmutabilidad)
CREATE TRIGGER trg_audit_invoices_update
AFTER UPDATE ON invoices
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (actor_user_id, entity, entity_id, action, before_json, after_json)
    VALUES (
        NULL, -- Se debe capturar desde la aplicación
        'invoices',
        NEW.id,
        'UPDATE',
        JSON_OBJECT(
            'status', OLD.status,
            'total', OLD.total
        ),
        JSON_OBJECT(
            'status', NEW.status,
            'total', NEW.total
        )
    );
END$

-- Trigger: Auditar eliminación de personal
CREATE TRIGGER trg_audit_staff_delete
AFTER UPDATE ON staff
FOR EACH ROW
BEGIN
    IF OLD.active = TRUE AND NEW.active = FALSE THEN
        INSERT INTO audit_logs (actor_user_id, entity, entity_id, action, before_json, after_json)
        VALUES (
            NULL, -- Se debe capturar desde la aplicación
            'staff',
            NEW.id,
            'SOFT_DELETE',
            JSON_OBJECT(
                'active', OLD.active,
                'specific_role', OLD.specific_role
            ),
            JSON_OBJECT(
                'active', NEW.active,
                'specific_role', NEW.specific_role
            )
        );
    END IF;
END$

-- Trigger: Validar horario de asistencia (R-001)
CREATE TRIGGER trg_validate_attendance_schedule
BEFORE INSERT ON attendance
FOR EACH ROW
BEGIN
    DECLARE is_holiday INT;
    DECLARE schedule_start TIME;
    DECLARE schedule_end TIME;
    
    -- Verificar si es día festivo
    SELECT COUNT(*) INTO is_holiday
    FROM holidays
    WHERE holiday_date = NEW.att_date;
    
    IF is_holiday > 0 AND NEW.override_reason IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede registrar asistencia en día festivo sin autorización';
    END IF;
    
    -- Obtener horario institucional
    SELECT MIN(start_time), MAX(end_time) INTO schedule_start, schedule_end
    FROM schedules
    WHERE day_of_week = DAYOFWEEK(NEW.att_date)
      AND active = TRUE;
    
    -- Validar horario de entrada
    IF NEW.check_in IS NOT NULL THEN
        IF NEW.check_in < schedule_start OR NEW.check_in > schedule_end THEN
            SET NEW.is_within_schedule = FALSE;
            IF NEW.override_reason IS NULL AND NEW.origin = 'automatic' THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Registro automático fuera de horario requiere intervención manual';
            END IF;
        END IF;
    END IF;
END$

-- Trigger: Actualizar estado de factura al recibir pago completo
CREATE TRIGGER trg_update_invoice_status_on_payment
AFTER INSERT ON payments
FOR EACH ROW
BEGIN
    DECLARE invoice_total DECIMAL(12,2);
    DECLARE total_paid DECIMAL(12,2);
    
    IF NEW.status = 'approved' THEN
        -- Obtener total de la factura
        SELECT total INTO invoice_total
        FROM invoices
        WHERE id = NEW.invoice_id;
        
        -- Calcular total pagado
        SELECT COALESCE(SUM(amount), 0) INTO total_paid
        FROM payments
        WHERE invoice_id = NEW.invoice_id
          AND status = 'approved';
        
        -- Actualizar estado de factura
        IF total_paid >= invoice_total THEN
            UPDATE invoices
            SET status = 'paid'
            WHERE id = NEW.invoice_id;
        END IF;
    END IF;
END$

DELIMITER ;

-- =========================
-- STORED PROCEDURES ÚTILES
-- =========================

DELIMITER $

-- Procedimiento: Registrar asistencia con validaciones
CREATE PROCEDURE sp_register_attendance(
    IN p_child_id BIGINT,
    IN p_att_date DATE,
    IN p_check_in TIME,
    IN p_status VARCHAR(20),
    IN p_origin VARCHAR(20),
    IN p_recorded_by BIGINT,
    IN p_justification VARCHAR(255)
)
BEGIN
    DECLARE v_classroom_id BIGINT;
    
    -- Obtener aula del niño
    SELECT classroom_id INTO v_classroom_id
    FROM children
    WHERE id = p_child_id AND active = TRUE;
    
    IF v_classroom_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Niño no encontrado o inactivo';
    END IF;
    
    -- Insertar registro de asistencia
    INSERT INTO attendance (
        child_id,
        att_date,
        check_in,
        status,
        origin,
        justification,
        recorded_by_user
    ) VALUES (
        p_child_id,
        p_att_date,
        p_check_in,
        p_status,
        p_origin,
        p_justification,
        p_recorded_by
    );
    
    SELECT LAST_INSERT_ID() AS attendance_id;
END$

-- Procedimiento: Obtener disponibilidad de educador para reuniones
CREATE PROCEDURE sp_get_educator_availability(
    IN p_educator_id BIGINT,
    IN p_date DATE
)
BEGIN
    SELECT 
        sch.start_time,
        sch.end_time,
        CASE 
            WHEN m.id IS NOT NULL THEN 'Ocupado'
            ELSE 'Disponible'
        END AS availability_status
    FROM staff s
    INNER JOIN staff_schedules ss ON ss.staff_id = s.id
    INNER JOIN schedules sch ON sch.id = ss.schedule_id
    LEFT JOIN meetings m ON m.educator_id = s.id 
        AND m.meeting_date = p_date
        AND m.start_time < sch.end_time
        AND m.end_time > sch.start_time
        AND m.status IN ('scheduled', 'confirmed')
    WHERE s.id = p_educator_id
      AND sch.day_of_week = DAYOFWEEK(p_date)
      AND (ss.effective_until IS NULL OR ss.effective_until >= p_date)
    ORDER BY sch.start_time;
END$

-- Procedimiento: Generar reporte de asistencia mensual
CREATE PROCEDURE sp_attendance_monthly_report(
    IN p_classroom_id BIGINT,
    IN p_month VARCHAR(7) -- Formato: 'YYYY-MM'
)
BEGIN
    SELECT 
        c.full_name,
        COUNT(*) AS total_days,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS days_present,
        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS days_absent,
        SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) AS days_late,
        ROUND(
            (SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100.0) / COUNT(*), 
            2
        ) AS attendance_percentage
    FROM children c
    LEFT JOIN attendance a ON a.child_id = c.id
    WHERE c.classroom_id = p_classroom_id
      AND c.active = TRUE
      AND DATE_FORMAT(a.att_date, '%Y-%m') = p_month
    GROUP BY c.id, c.full_name
    ORDER BY c.full_name;
END$

DELIMITER ;

-- =========================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =========================

-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_attendance_composite ON attendance(child_id, att_date, status);
CREATE INDEX idx_weekly_plans_composite ON weekly_plans(classroom_id, week_start, status);
CREATE INDEX idx_payments_composite ON payments(invoice_id, status, paid_at);
CREATE INDEX idx_notifications_composite ON notifications(to_user_id, status, created_at);

-- Índices para búsquedas de texto
CREATE FULLTEXT INDEX idx_children_fulltext ON children(full_name);
CREATE FULLTEXT INDEX idx_guardians_fulltext ON guardians(full_name);

-- =========================
-- CONFIGURACIÓN DE SEGURIDAD
-- =========================

-- Nota: Estas configuraciones deben ajustarse según el entorno
-- Crear usuario de aplicación con permisos limitados
-- CREATE USER 'guarderia_app'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE ON guarderia_db.* TO 'guarderia_app'@'localhost';
-- GRANT DELETE ON guarderia_db.audit_logs TO 'guarderia_app'@'localhost';
-- FLUSH PRIVILEGES;

-- =========================
-- COMENTARIOS FINALES
-- =========================

-- Restaurar configuración original
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Verificar integridad
-- SELECT 'Base de datos creada exitosamente' AS status;