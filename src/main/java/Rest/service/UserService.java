package Rest.service;

import Rest.model.User;

import java.util.List;

public interface UserService {
    public List<User> selectAllUsers();
    public void saveUserWithRoleList(User user, String[] roles);
    public void saveUser(User user);
    public void delete(Long id);
    public void updateWithRoles(User user, String[] roles);
    public void update(User user);
}
