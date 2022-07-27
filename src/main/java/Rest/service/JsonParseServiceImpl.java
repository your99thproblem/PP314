package Rest.service;

import Rest.model.Role;
import Rest.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Map;

@Service
public class JsonParseServiceImpl implements JsonParseService {
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private RoleService roleService;


    @Override
    public User parseToUser(Map map) {
        User user = new User();
        ObjectMapper mapper = new ObjectMapper();
        ArrayList<String> arr = null;
        if (map.get("roles_id") != null) {
            System.out.println(map.get("roles_id"));
            arr = (ArrayList) map.get("roles_id");
            map.remove("roles_id");
        } else if (map.containsKey("roles_id")) {
            map.remove("roles_id");
        }
        user = mapper.convertValue(map, User.class);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        for (int i = 0; i < arr.size(); i++) {
            arr.get(i);
            user.addRole(roleService.findRoleById(Long.valueOf(arr.get(i))));
        }
        return user;
    }
}
