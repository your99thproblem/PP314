package Rest.dao;

import Rest.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import java.util.List;
@Repository
public class UserDaoimpl implements UserDao{
    @PersistenceContext
    private EntityManager entityManager;
    @Autowired
    private RoleDao roleDao;
    @Override
    public void saveWithRoles(User user, String[] roles) {
        for (String ids : roles) {
            user.addRole(roleDao.findRoleById(Long.valueOf(ids)));
        }
        entityManager.persist(user);
    }

    @Override
    public void save(User user) {
        entityManager.persist(user);
    }

    @Override
    public User updateWithRolesFromTemplate(User user, String[] roles) {
        for (String ids : roles) {
            user.addRole(roleDao.findRoleById(Long.valueOf(ids)));
        }
        return entityManager.merge(user);
    }

    @Override
    public User update(User user) {
        return entityManager.merge(user);
    }

    @Override
    public List<User> findAll() {
        return entityManager.createQuery("Select u from User u ", User.class).getResultList();
    }

    @Override
    public User findById(Long id) {
        return entityManager.find(User.class, id);
    }

    @Override
    public void detete(Long id) {
        entityManager.remove(findById(id));

    }

    @Override
    public User getUserByEmailWithRoles(String email) {
        try {
            User user = entityManager.createQuery("Select u from User u " +
                            "join fetch u.userRoleList lr " +
                            "join fetch lr.role " +
                            "WHERE u.email = :email", User.class)
                    .setParameter("email", email)
                    .getSingleResult();
            return user;
        } catch (NoResultException nre) {
            User user = null;
            return user;
        }
    }

    @Override
    public Long count() {
        return (Long) entityManager.createQuery("select count(u) from User u").getSingleResult();
    }
}
