package Rest.controller;

import Rest.model.CustomUserDetails;
import Rest.model.User;
import Rest.service.JsonParseService;
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

    @Autowired
    UserRestController(UserService userService, JsonParseService jsonParseService) {
        this.userService = userService;
        this.jsonParseService = jsonParseService;
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
        System.out.println("check");
        User user = jsonParseService.parseToUser(map);
        System.out.println(map);
      userService.saveUser(user);
        System.out.println("zdraste");
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
