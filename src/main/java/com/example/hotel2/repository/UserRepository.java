package com.example.hotel2.repository;

import com.example.hotel2.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    public boolean existsByEmailAndPassword(String email, String password);
}
