package dev.houssein.DVDLibrary.service;

import dev.houssein.DVDLibrary.dao.DvdDao;
import dev.houssein.DVDLibrary.dto.Dvd;
import dev.houssein.DVDLibrary.dto.Rating;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DvdService {

    private final DvdDao dvdDao;

    @Autowired
    public DvdService(DvdDao dvdDao) {
        this.dvdDao = dvdDao;
    }

    @Transactional
    public Dvd saveDvd(Dvd dvd) {
        return dvdDao.save(dvd);
    }

    @Transactional
    public Dvd getDvdById(Integer dvdId) {
        return dvdDao.findById(dvdId)
                .orElseThrow(() -> new IllegalArgumentException("DVD with ID " + dvdId + " not found"));
    }

    @Transactional
    public List<Dvd> getAllDvds() {
        return dvdDao.findAll();
    }

    @Transactional
    public List<Dvd> getDvdsByTitle(String dvdTitle) {
        return dvdDao.findByDvdTitleContainingIgnoreCase(dvdTitle);
    }

    @Transactional
    public List<Dvd> getDvdsByReleaseYear(String releaseYear) {
        return dvdDao.findByReleaseYear(releaseYear);
    }

    @Transactional
    public List<Dvd> getDvdsByDirector(String director) {
        return dvdDao.findByDirectorContainingIgnoreCase(director);
    }

    @Transactional
    public List<Dvd> getDvdsByRating(Rating rating) {
        return dvdDao.findByDvdRating(rating);
    }

    @Transactional
    public Dvd updateDvd(Integer dvdId, Dvd dvdDetails) {
        Dvd existingDvd = dvdDao.findById(dvdId)
                .orElseThrow(() -> new IllegalArgumentException("DVD with ID " + dvdId + " not found"));

        // Update the fields
        existingDvd.setDvdTitle(dvdDetails.getDvdTitle());
        existingDvd.setReleaseYear(dvdDetails.getReleaseYear());
        existingDvd.setDirector(dvdDetails.getDirector());
        existingDvd.setDvdRating(dvdDetails.getDvdRating());
        existingDvd.setNote(dvdDetails.getNote());

        return dvdDao.save(existingDvd);
    }

    @Transactional
    public void deleteDvd(Integer dvdId) {
        if (!dvdDao.existsById(dvdId)) {
            throw new IllegalArgumentException("DVD with ID " + dvdId + " not found");
        }
        dvdDao.deleteById(dvdId);
    }


}
