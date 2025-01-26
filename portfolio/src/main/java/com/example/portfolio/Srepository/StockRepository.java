package com.example.portfolio.Srepository;

import com.example.portfolio.Smodel.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {

    boolean existsById(Integer id);
    @Modifying
    @Query(value = "ALTER TABLE stock AUTO_INCREMENT = 1", nativeQuery = true)
    void resetAutoIncrement();

}