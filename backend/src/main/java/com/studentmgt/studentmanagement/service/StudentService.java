
package com.studentmgt.studentmanagement.service;

import com.studentmgt.studentmanagement.entity.Student;
import com.studentmgt.studentmanagement.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get student by ID
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Student not found with ID: " + id));
    }

    // Add student
    public Student addStudent(Student student) {

        if (studentRepository.existsByStudentCode(student.getStudentCode())) {
            throw new RuntimeException("Student ID already exists");
        }

        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        student.setStatus("Active");

        return studentRepository.save(student);
    }

    // Update student
    public Student updateStudent(Long id, Student updatedStudent) {

        Student existingStudent = getStudentById(id);

        if (!existingStudent.getStudentCode().equals(updatedStudent.getStudentCode())
                && studentRepository.existsByStudentCode(updatedStudent.getStudentCode())) {
            throw new RuntimeException("Student ID already exists");
        }

        if (!existingStudent.getEmail().equals(updatedStudent.getEmail())
                && studentRepository.existsByEmail(updatedStudent.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        existingStudent.setStudentCode(updatedStudent.getStudentCode());
        existingStudent.setFullName(updatedStudent.getFullName());
        existingStudent.setEmail(updatedStudent.getEmail());
        existingStudent.setPhone(updatedStudent.getPhone());
        existingStudent.setCourse(updatedStudent.getCourse());
        existingStudent.setGender(updatedStudent.getGender());
        existingStudent.setDateOfBirth(updatedStudent.getDateOfBirth());
        existingStudent.setAddress(updatedStudent.getAddress());

        return studentRepository.save(existingStudent);
    }

    // Delete student
    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        studentRepository.delete(student);
    }
}
