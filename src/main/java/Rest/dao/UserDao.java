package Rest.dao;

import Rest.model.User;

import java.util.List;

public interface UserDao {
    public void saveWithRoles(User user, String[] roles);
    public void save(User user);
    public User updateWithRolesFromTemplate(User user, String[] roles);
    public User update(User user);
    List<User> findAll();
    User findById(Long id);
    void detete(Long id);
    public User getUserByEmailWithRoles(String email);
    public Long count();
}
