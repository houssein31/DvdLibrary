package dev.houssein.DVDLibrary.dto;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Dvd {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dvd_id")
    private int dvdId;

    @Column(name = "dvd_title", nullable = false, length = 255)
    private String dvdTitle;

    @Column(name = "release_year", nullable = false, length = 4)
    private String releaseYear;

    @Column(name = "director", length = 255)
    private String director;

    @Enumerated(EnumType.STRING)
    @Column(name = "dvd_rating", nullable = false)
    private Rating dvdRating;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;


    public Dvd(int dvdId, String dvdTitle, String releaseYear, String director, Rating dvdRating, String note) {
        this.dvdId = dvdId;
        this.dvdTitle = dvdTitle;
        this.releaseYear = releaseYear;
        this.director = director;
        this.dvdRating = dvdRating;
        this.note = note;
    }

    public Dvd() {

    }
}
