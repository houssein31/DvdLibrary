package dev.houssein.DVDLibrary.controller;

import dev.houssein.DVDLibrary.dto.Dvd;
import dev.houssein.DVDLibrary.dto.Rating;
import dev.houssein.DVDLibrary.service.DvdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dvd")
public class DvdController {

    private final DvdService dvdService;

    @Autowired
    public DvdController(DvdService dvdService) {
        this.dvdService = dvdService;
    }

    @PostMapping
    public ResponseEntity<Dvd> createDvd(@RequestBody Dvd dvd) {
        try {
            Dvd savedDvd = dvdService.saveDvd(dvd); // Ensure this method exists in your service
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDvd);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{dvdId}")
    public ResponseEntity<Dvd> getDvdById(@PathVariable Integer dvdId) {
        try {
            Dvd dvd = dvdService.getDvdById(dvdId);
            return ResponseEntity.ok(dvd);
//            return ResponseEntity.status(HttpStatus.OK).body(dvd);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Dvd>> getAllDvds() {
        List<Dvd> dvds = dvdService.getAllDvds();
        return ResponseEntity.ok(dvds);
    }

    @GetMapping("/title/{dvdTitle}")
    public ResponseEntity<List<Dvd>> getDvdsByTitle(@PathVariable String dvdTitle) {
        try {
            List<Dvd> dvds = dvdService.getDvdsByTitle(dvdTitle);
            return ResponseEntity.ok(dvds);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/year/{releaseYear}")
    public ResponseEntity<List<Dvd>> getDvdsByReleaseYear(@PathVariable String releaseYear) {
        try {
            List<Dvd> dvds = dvdService.getDvdsByReleaseYear(releaseYear);
            return ResponseEntity.ok(dvds);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/director/{director}")
    public ResponseEntity<List<Dvd>> getDvdsByDirector(@PathVariable String director) {
        try {
            List<Dvd> dvds = dvdService.getDvdsByDirector(director);
            return ResponseEntity.ok(dvds);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/rating/{rating}")
    public ResponseEntity<List<Dvd>> getDvdsByRating(@PathVariable String rating) {
        try {
            Rating dvdRating = Rating.fromString(rating); // Convert to enum here
            List<Dvd> dvds = dvdService.getDvdsByRating(dvdRating);
            return ResponseEntity.ok(dvds);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{dvdId}")
    public ResponseEntity<Dvd> updateDvd(@PathVariable Integer dvdId, @RequestBody Dvd dvdDetails) {
        try {
            Dvd updatedDvd = dvdService.updateDvd(dvdId, dvdDetails);
            return ResponseEntity.ok(updatedDvd);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{dvdId}")
    public ResponseEntity<Void> deleteDvd(@PathVariable Integer dvdId) {
        try {
            dvdService.deleteDvd(dvdId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // 204 No Content
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404 Not Found
        }
    }


}
