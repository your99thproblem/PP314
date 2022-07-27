package Rest.controller;

import Rest.model.CustomUserDetails;
import Rest.model.Role;
import Rest.model.User;
import Rest.service.JsonParseService;
import Rest.service.RoleService;
import Rest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserRestController {
    private UserService userService;
    private JsonParseService jsonParseService;

    private RoleService roleService;

    @Autowired
    UserRestController(UserService userService, JsonParseService jsonParseService, RoleService roleService) {
        this.userService = userService;
        this.jsonParseService = jsonParseService;
        this.roleService = roleService;
    }

    @GetMapping("/userAuth")
    public ResponseEntity<CustomUserDetails> getUserAuthority() {
        CustomUserDetails authorizedUser = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return new ResponseEntity<>(authorizedUser, HttpStatus.OK);
    }

    @GetMapping("/userList")
    public ResponseEntity<List<User>> userList() {
        List<User> usersList = userService.selectAllUsers();
        return new ResponseEntity<>(usersList, HttpStatus.OK);
    }

    @PostMapping("/createUser")
    public ResponseEntity<?> createUser(@RequestBody Map map) {
        userService.saveUser(jsonParseService.parseToUser(map));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/listRoles")
    private List<Role> allRoles() {
        return roleService.selectAllRoles();
    }

    @GetMapping("/getUser/{id}")
    public User getUser(@PathVariable("id") Long id) {
        return userService.findById(id);
    }

    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<User> DeleteModal(@PathVariable("id") Long id) {
        userService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
