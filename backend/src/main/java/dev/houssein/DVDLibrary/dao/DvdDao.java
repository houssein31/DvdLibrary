package dev.houssein.DVDLibrary.dao;

import dev.houssein.DVDLibrary.dto.Dvd;
import dev.houssein.DVDLibrary.dto.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DvdDao extends JpaRepository<Dvd, Integer> {

    List<Dvd> findByDvdTitleContainingIgnoreCase(String dvdTitle);

    List<Dvd> findByReleaseYear(String releaseYear);

    List<Dvd> findByDirectorContainingIgnoreCase(String director);

    List<Dvd> findByDvdRating(Rating rating);
}
