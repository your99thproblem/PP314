package Rest.service;

import Rest.model.Role;
import Rest.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Map;

@Service
public class JsonParseServiceImpl implements JsonParseService {
    @Autowired
    private RoleService roleService;


    @Override
    public User parseToUser(Map map) {
        User user = new User();
        ObjectMapper mapper = new ObjectMapper();
        if (map.containsKey("roles_id") && map.get("roles_id") != null) {

            System.out.println(map.get("roles_id"));
            ArrayList<Integer> arr = (ArrayList) map.get("roles_id");
            for (int i = 0; i < arr.size(); i++) {
                user.addRole(roleService.findRoleById(Long.valueOf(arr.get(i))));
                System.out.println("check " + i);
            }
            map.remove("roles_id");
        } else if (map.get("roles_id") == null) {
            map.remove("roles_id");
        }
        user = mapper.convertValue(map, User.class);
        System.out.println(user);

        return user;
    }
}
