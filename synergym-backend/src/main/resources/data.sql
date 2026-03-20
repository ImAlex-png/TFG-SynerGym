-- 1. USUARIOS (Contraseñas encriptadas con BCrypt)
-- Admin: admin123
-- Entrenador: vendedor2024
-- Alumno: password123
INSERT INTO usuario (nombre, apellidos, dni, telefono, email, password, rol, activo) VALUES 
('Admin', 'Principal', '11111111A', '600111222', 'admin@synergym.com', 'admin123', 'ADMINISTRADOR', true),

('Marcos', 'Pérez', '44444444D', '610111222', 'marcos.entrenador@synergym.com', 'vendedor2024', 'ENTRENADOR', true),
('Sara', 'López', '55555555E', '610333444', 'sara.entrenador@synergym.com', 'vendedor2024', 'ENTRENADOR', true),

('Antonio', 'Sánchez', '90000001A', '620111001', 'antonio.alumno@gmail.com', 'password123', 'ALUMNO', true),
('María', 'Jiménez', '90000002B', '620111002', 'maria.alumno@gmail.com', 'password123', 'ALUMNO', true),
('Pepe', 'Navarro', '90000003C', '620111003', 'pepe.alumno@gmail.com', 'password123', 'ALUMNO', true),
('Carmen', 'Romero', '90000004D', '620111004', 'carmen.alumno@yahoo.com', 'password123', 'ALUMNO', true),
('Francisco', 'Gil', '90000005E', '620111005', 'francisco.alumno@hotmail.com', 'password123', 'ALUMNO', true);


-- 2. CLASES 
-- (Asignadas automáticamente a los primeros entrenadores creados: IDs 2 y 3)
INSERT INTO clases (nombre, fecha_inicio, fecha_fin, hora_inicio, hora_fin, capacidad_maxima, id_usuario_entrenador) VALUES 
('Spinning Matutino', '2026-04-01', '2026-04-30', '08:00:00', '09:00:00', 20, 2),
('Yoga Flow', '2026-04-01', '2026-04-30', '09:30:00', '10:30:00', 15, 3),
('CrossFit Básico', '2026-04-01', '2026-05-31', '10:00:00', '11:00:00', 25, 2),
('Zumba', '2026-04-01', '2026-05-31', '18:00:00', '19:00:00', 30, 3),
('Pilates Avanzado', '2026-04-01', '2026-06-30', '19:00:00', '20:00:00', 12, 2);

INSERT INTO clases (nombre, fecha_inicio, fecha_fin, hora_inicio, hora_fin, capacidad_maxima, id_usuario_entrenador) VALUES 
('GAP', '2026-04-01', '2026-06-30', '11:00:00', '12:00:00', 20, 3),
('Boxeo', '2026-04-01', '2026-04-30', '20:00:00', '21:00:00', 16, 2);


-- 3. INSCRIPCIONES
-- (Alumnos con IDs del 4 al 8, asignados a diferentes Clases [IDs 1 al 7])
INSERT INTO inscripcion (estado, pagado, fecha_inscripcion, id_usuario_alumno, id_clases) VALUES 
('ACEPTADA', true, '2026-03-20', 4, 1),
('ACEPTADA', true, '2026-03-21', 5, 1),
('EN_PROCESO', false, '2026-03-22', 7, 1),

('ACEPTADA', true, '2026-03-19', 8, 2),
('RECHAZADA', false, '2026-03-21', 4, 2),

('ACEPTADA', true, '2026-03-10', 4, 3),
('ACEPTADA', true, '2026-03-11', 6, 3),
('ACEPTADA', true, '2026-03-12', 8, 3),

('ACEPTADA', true, '2026-03-15', 5, 4),
('EN_PROCESO', false, '2026-03-16', 7, 4),

('ACEPTADA', true, '2026-03-18', 6, 5);
