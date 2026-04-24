import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashGen {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("admin123 -> " + encoder.encode("admin123"));
        System.out.println("vendedor2024 -> " + encoder.encode("vendedor2024"));
        System.out.println("password123 -> " + encoder.encode("password123"));
    }
}
