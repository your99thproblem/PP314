package Rest.service;

import Rest.dao.UserDao;
import Rest.model.CustomUserDetails;
import Rest.model.User;
import Rest.model.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserDao userDao;

    @Override
    public CustomUserDetails loadUserByUsername(String email) throws BadCredentialsException {

        User currentUser = userDao.getUserByEmailWithRoles(email);

        if (currentUser != null) {

            Set<GrantedAuthority> authorities = new HashSet<>();
            for (UserRole roles : currentUser.getUserRoleList()) {
                authorities.add(new SimpleGrantedAuthority(roles.getRole().getName()));
            }
            CustomUserDetails customUser = new CustomUserDetails();
            customUser.setUser(currentUser);
            customUser.setAuthorities(authorities);
            return customUser;

        } else {
            throw new BadCredentialsException(String.format("User with email '%s' not found", email));

            }
        }
    public static boolean hasAdminRole (CustomUserDetails user) {
        return user.getAuthorities().stream()
                .anyMatch(r -> r.getAuthority().equals("ROLE_ADMIN"));
    }
}
