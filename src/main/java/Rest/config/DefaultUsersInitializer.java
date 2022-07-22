package Rest.config;

import Rest.model.Role;
import Rest.model.User;
import Rest.service.RoleService;
import Rest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class DefaultUsersInitializer {
    @Autowired
    UserService userService;
    @Autowired
    RoleService roleService;
    @Autowired
    PasswordEncoder bCryptPasswordEncoder;

    @PostConstruct
    void init() {
        Role userRole = new Role();
        userRole.setName("ROLE_ADMIN");
        Role adminRole = new Role();
        adminRole.setName("ROLE_USER");
        roleService.saveRole(userRole);
        roleService.saveRole(adminRole);
        User admin = new User();
        userService.saveUser(admin);
        for (Role role:
             roleService.selectAllRoles()) {
            admin.addRole(role);
        }
        admin.setName("Administrator");
        admin.setEmail("admin@admin.ru");
        admin.setPassword(bCryptPasswordEncoder.encode("admin"));
        userService.update(admin);

        User user = new User();
        user.setName("User");
        user.setPassword(bCryptPasswordEncoder.encode("user"));
        user.setEmail("user@user.ru");
        userService.saveUser(user);
        user.addRole(roleService.findByRoleName("ROLE_USER"));
        userService.update(user);
    }
}
