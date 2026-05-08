-- 1. USUARIOS (Contraseñas en texto plano para desarrollo)
-- Admin: admin123
-- Entrenador: vendedor2024
-- Alumno: password123
INSERT INTO usuario (nombre, apellidos, dni, telefono, email, password, rol, activo) VALUES 
('Admin', 'Principal', '11111111A', '600111222', 'admin@synergym.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'ADMINISTRADOR', true),

('Marcos', 'Pérez', '44444444D', '610111222', 'marcos.entrenador@synergym.com', '$2a$12$8oEKbikfK28qd/alrS1m2Oc3DBBApmYUjlkkNqGlKZrxc/9k6xTYy', 'ENTRENADOR', true),
('Sara', 'López', '55555555E', '610333444', 'sara.entrenador@synergym.com', '$$2a$12$8oEKbikfK28qd/alrS1m2Oc3DBBApmYUjlkkNqGlKZrxc/9k6xTYy', 'ENTRENADOR', true),

('Antonio', 'Sánchez', '90000001A', '620111001', 'antonio.alumno@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'ALUMNO', true),
('María', 'Jiménez', '90000002B', '620111002', 'maria.alumno@gmail.com', '$2a$12$dS6W.dFvuxbm3.ByMTAzOukM5r2RsDO5K.xo9GUeAoI5BC.MX7eHK', 'ALUMNO', true),
('Pepe', 'Navarro', '90000003C', '620111003', 'pepe.alumno@gmail.com', '$2a$12$dS6W.dFvuxbm3.ByMTAzOukM5r2RsDO5K.xo9GUeAoI5BC.MX7eHK', 'ALUMNO', true),
('Carmen', 'Romero', '90000004D', '620111004', 'carmen.alumno@yahoo.com', '$2a$12$dS6W.dFvuxbm3.ByMTAzOukM5r2RsDO5K.xo9GUeAoI5BC.MX7eHK', 'ALUMNO', true),
('Francisco', 'Gil', '90000005E', '620111005', 'francisco.alumno@hotmail.com', '$2a$12$dS6W.dFvuxbm3.ByMTAzOukM5r2RsDO5K.xo9GUeAoI5BC.MX7eHK', 'ALUMNO', true);


-- 2. CLASES (Programación de Mayo 2026 - 2 clases por día)
-- Lunes a Domingo, rotando disciplinas
INSERT INTO clases (nombre, fecha, hora_inicio, hora_fin, capacidad_maxima, id_usuario_entrenador) VALUES 
-- Semana 1
('CrossFit WOD', '2026-05-01', '08:00:00', '09:00:00', 20, 2),
('Yoga Flow', '2026-05-01', '10:00:00', '11:00:00', 15, 3),
('Spinning HIIT', '2026-05-02', '09:00:00', '10:00:00', 25, 2),
('Zumba Party', '2026-05-02', '18:00:00', '19:00:00', 30, 3),
('Pilates Core', '2026-05-03', '11:00:00', '12:00:00', 12, 3),
('Boxeo Técnico', '2026-05-03', '19:00:00', '20:00:00', 16, 2),
('Body Pump', '2026-05-04', '08:30:00', '09:30:00', 20, 2),
('Yoga Restaurativo', '2026-05-04', '17:30:00', '18:30:00', 15, 3),
('GAP Intenso', '2026-05-05', '10:00:00', '11:00:00', 20, 3),
('CrossFit Strength', '2026-05-05', '19:00:00', '20:00:00', 25, 2),
('Spinning Endurance', '2026-05-06', '08:00:00', '09:00:00', 25, 2),
('Zumba Gold', '2026-05-06', '11:00:00', '12:00:00', 30, 3),
('Pilates Balance', '2026-05-07', '09:30:00', '10:30:00', 15, 3),
('Kick Boxing', '2026-05-07', '20:00:00', '21:00:00', 16, 2),

-- Semana 2 (Repetimos patrón con ligeras variaciones)
('CrossFit WOD', '2026-05-08', '08:00:00', '09:00:00', 20, 2),
('Yoga Flow', '2026-05-08', '10:00:00', '11:00:00', 15, 3),
('Spinning HIIT', '2026-05-09', '09:00:00', '10:00:00', 25, 2),
('Zumba Party', '2026-05-09', '18:00:00', '19:00:00', 30, 3),
('Pilates Core', '2026-05-10', '11:00:00', '12:00:00', 12, 3),
('Boxeo Técnico', '2026-05-10', '19:00:00', '20:00:00', 16, 2),
('Body Pump', '2026-05-11', '08:30:00', '09:30:00', 20, 2),
('Yoga Restaurativo', '2026-05-11', '17:30:00', '18:30:00', 15, 3),
('GAP Intenso', '2026-05-12', '10:00:00', '11:00:00', 20, 3),
('CrossFit Strength', '2026-05-12', '19:00:00', '20:00:00', 25, 2),
('Spinning Endurance', '2026-05-13', '08:00:00', '09:00:00', 25, 2),
('Zumba Gold', '2026-05-13', '11:00:00', '12:00:00', 30, 3),
('Pilates Balance', '2026-05-14', '09:30:00', '10:30:00', 15, 3),
('Kick Boxing', '2026-05-14', '20:00:00', '21:00:00', 16, 2),

-- Semana 3
('CrossFit WOD', '2026-05-15', '08:00:00', '09:00:00', 20, 2),
('Yoga Flow', '2026-05-15', '10:00:00', '11:00:00', 15, 3),
('Spinning HIIT', '2026-05-16', '09:00:00', '10:00:00', 25, 2),
('Zumba Party', '2026-05-16', '18:00:00', '19:00:00', 30, 3),
('Pilates Core', '2026-05-17', '11:00:00', '12:00:00', 12, 3),
('Boxeo Técnico', '2026-05-17', '19:00:00', '20:00:00', 16, 2),
('Body Pump', '2026-05-18', '08:30:00', '09:30:00', 20, 2),
('Yoga Restaurativo', '2026-05-18', '17:30:00', '18:30:00', 15, 3),
('GAP Intenso', '2026-05-19', '10:00:00', '11:00:00', 20, 3),
('CrossFit Strength', '2026-05-19', '19:00:00', '20:00:00', 25, 2),
('Spinning Endurance', '2026-05-20', '08:00:00', '09:00:00', 25, 2),
('Zumba Gold', '2026-05-20', '11:00:00', '12:00:00', 30, 3),
('Pilates Balance', '2026-05-21', '09:30:00', '10:30:00', 15, 3),
('Kick Boxing', '2026-05-21', '20:00:00', '21:00:00', 16, 2),

-- Semana 4 y final
('CrossFit WOD', '2026-05-22', '08:00:00', '09:00:00', 20, 2),
('Yoga Flow', '2026-05-22', '10:00:00', '11:00:00', 15, 3),
('Spinning HIIT', '2026-05-23', '09:00:00', '10:00:00', 25, 2),
('Zumba Party', '2026-05-23', '18:00:00', '19:00:00', 30, 3),
('Pilates Core', '2026-05-24', '11:00:00', '12:00:00', 12, 3),
('Boxeo Técnico', '2026-05-24', '19:00:00', '20:00:00', 16, 2),
('Body Pump', '2026-05-25', '08:30:00', '09:30:00', 20, 2),
('Yoga Restaurativo', '2026-05-25', '17:30:00', '18:30:00', 15, 3),
('GAP Intenso', '2026-05-26', '10:00:00', '11:00:00', 20, 3),
('CrossFit Strength', '2026-05-26', '19:00:00', '20:00:00', 25, 2),
('Spinning Endurance', '2026-05-27', '08:00:00', '09:00:00', 25, 2),
('Zumba Gold', '2026-05-27', '11:00:00', '12:00:00', 30, 3),
('Pilates Balance', '2026-05-28', '09:30:00', '10:30:00', 15, 3),
('Kick Boxing', '2026-05-28', '20:00:00', '21:00:00', 16, 2),
('HIIT Final', '2026-05-29', '09:00:00', '10:00:00', 20, 2),
('Yoga Zen', '2026-05-29', '18:00:00', '19:00:00', 15, 3),
('Masterclass Zumba', '2026-05-30', '10:00:00', '12:00:00', 50, 3),
('Combate Final', '2026-05-31', '19:00:00', '21:00:00', 20, 2);


-- 3. INSCRIPCIONES (Algunas de prueba para los primeros días)
INSERT INTO inscripcion (estado, fecha_inscripcion, id_usuario_alumno, id_clases) VALUES 
('ACEPTADA', '2026-05-01', 4, 1),
('ACEPTADA', '2026-05-01', 5, 2),
('ACEPTADA', '2026-05-02', 6, 3),
('ACEPTADA', '2026-05-02', 7, 4),
('ACEPTADA', '2026-05-03', 8, 5);


-- 4. CONVERSACIONES (Chats iniciales)
INSERT INTO conversacion (nombre, tipo, fecha_creacion) VALUES 
(NULL, 'PRIVADA', CURRENT_TIMESTAMP),           -- ID 1: Admin <-> Marcos
(NULL, 'PRIVADA', CURRENT_TIMESTAMP),           -- ID 2: Sara <-> María
('Grupo CrossFit Mañana', 'GRUPAL', CURRENT_TIMESTAMP); -- ID 3: Marcos + Alumnos

-- 5. PARTICIPANTES (Asociar usuarios a los chats)
INSERT INTO participante (id_conversacion, id_usuario) VALUES 
(1, 1), (1, 2), -- Admin y Marcos en Chat 1
(2, 3), (2, 5), -- Sara y María en Chat 2
(3, 2), (3, 4), (3, 6), (3, 8); -- Marcos, Antonio, Pepe y Francisco en Chat 3

-- 6. MENSAJES (Historial inicial)
INSERT INTO mensaje (contenido, fecha_envio, id_usuario_emisor, id_conversacion) VALUES 
('Hola Marcos, ¿cómo van las clases de hoy?', CURRENT_TIMESTAMP, 1, 1),
('Todo bien, Admin. El grupo de Spinning está lleno.', CURRENT_TIMESTAMP, 2, 1),

('María, recuerda traer la esterilla para Yoga.', CURRENT_TIMESTAMP, 3, 2),
('¡Gracias Sara! Allí estaré.', CURRENT_TIMESTAMP, 5, 2),

('Bienvenidos al grupo de CrossFit básico. ¡Mañana a tope!', CURRENT_TIMESTAMP, 2, 3),
('¿A qué hora empezamos?', CURRENT_TIMESTAMP, 4, 3);
