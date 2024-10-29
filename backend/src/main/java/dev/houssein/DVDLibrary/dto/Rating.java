package dev.houssein.DVDLibrary.dto;

public enum Rating {

    G,
    PG,
    PG13,
    R,
    NC17;

    public static Rating fromString(String rating) {
        for (Rating r : Rating.values()) {
            if (r.name().equalsIgnoreCase(rating)) {
                return r;
            }
        }
        throw new IllegalArgumentException("No enum constant " + rating);
    }
}
