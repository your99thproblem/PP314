package Rest.service;

import Rest.dao.UserDao;
import Rest.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private UserDao userDao;

    @Override
    public List<User> selectAllUsers() {
        return userDao.findAll();
    }

    @Override
    @Transactional
    public void saveUserWithRoleList(User user, String[] roles) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userDao.saveWithRoles(user, roles);
    }

    @Override
    @Transactional
    public void saveUser(User user) {
        userDao.save(user);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        userDao.detete(id);
    }

    @Override
    @Transactional
    public void updateWithRoles(User user, String[] roles) {

        userDao.updateWithRolesFromTemplate(user, roles);
    }

    @Override
    @Transactional
    public void update(User user) {
        userDao.update(user);
    }
}
