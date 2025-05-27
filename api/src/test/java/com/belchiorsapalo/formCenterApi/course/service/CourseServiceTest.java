package com.belchiorsapalo.formCenterApi.course.service;

import com.belchiorsapalo.formCenterApi.course.dtos.CourseRegisterDTO;
import com.belchiorsapalo.formCenterApi.course.model.Course;
import com.belchiorsapalo.formCenterApi.course.repository.CourseRepository;
import com.belchiorsapalo.formCenterApi.exceptions.ResourceAlreadyExistsException;
import com.belchiorsapalo.formCenterApi.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    private CourseRegisterDTO validCourseDTO;
    private Course validCourse;
    private UUID courseId;

    @BeforeEach
    void setUp() {
        courseId = UUID.randomUUID();
        validCourseDTO = new CourseRegisterDTO(
            "Java Programming",
            "Learn Java fundamentals",
            "6 months",
            new BigDecimal("1500.00")
        );
        
        validCourse = new Course(validCourseDTO);
        validCourse.setId(courseId);
    }

    @Test
    void createShouldSaveNewCourseWhenValidData() {
        // Arrange
        when(courseRepository.existsByTitle(anyString())).thenReturn(false);
        when(courseRepository.save(any(Course.class))).thenReturn(validCourse);

        // Act
        Course result = courseService.register(validCourseDTO);

        // Assert
        assertNotNull(result);
        assertEquals(validCourseDTO.title(), result.getTitle());
        assertEquals(validCourseDTO.description(), result.getDescription());
        verify(courseRepository).save(any(Course.class));
    }

    @Test
    void createShouldThrowExceptionWhenNameExists() {
        // Arrange
        when(courseRepository.existsByTitle(anyString())).thenReturn(true);

        // Act & Assert
        assertThrows(ResourceAlreadyExistsException.class,
            () -> courseService.register(validCourseDTO));
    }

    @Test
    void getAllShouldReturnListOfCourses() {
        // Arrange
        List<Course> courses = Arrays.asList(validCourse);
        when(courseRepository.findAll()).thenReturn(courses);

        // Act
        List<Course> result = courseService.getAll();

        // Assert
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(validCourse.getTitle(), result.get(0).getTitle());
    }

    @Test
    void getByIdShouldReturnCourseWhenExists() {
        // Arrange
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(validCourse));

        // Act
        Course result = courseService.getOne(courseId);

        // Assert
        assertNotNull(result);
        assertEquals(validCourse.getTitle(), result.getTitle());
    }

    @Test
    void getByIdShouldThrowExceptionWhenNotFound() {
        // Arrange
        when(courseRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class,
            () -> courseService.getOne(UUID.randomUUID()));
    }

    @Test
    void updateShouldModifyCourseWhenValidData() {
        // Arrange
        CourseRegisterDTO updateDTO = new CourseRegisterDTO(
            "Updated Java Course",
            "Updated description",
            "8 months",
            new BigDecimal("2000.00")
        );
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(validCourse));
        when(courseRepository.save(any(Course.class))).thenReturn(validCourse);

        // Act
        courseService.update(updateDTO, courseId);

        // Assert
        verify(courseRepository).save(any(Course.class));
    }

    @Test
    void deleteShouldRemoveCourseWhenExists() {
        // Arrange
        when(courseRepository.existsById(courseId)).thenReturn(true);

        // Act
        courseService.delete(courseId);

        // Assert
        verify(courseRepository).deleteById(courseId);
    }

    @Test
    void deleteShouldThrowExceptionWhenNotFound() {
        // Arrange
        when(courseRepository.existsById(any(UUID.class))).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class,
            () -> courseService.delete(UUID.randomUUID()));
    }
}
