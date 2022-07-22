package Rest.service;

import Rest.dao.RoleDao;
import Rest.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
public class RoleServiceImpl implements RoleService{
    @Autowired
    private RoleDao roleDao;
    @Override
    public List<Role> selectAllRoles() {
        return roleDao.findAll();
    }

    @Override
    @Transactional
    public void saveRole(Role role) {
        roleDao.saveRole(role);
    }

    @Override
    public Role findByRoleName(String roleName) {
        return roleDao.findByRoleName(roleName);
    }

    @Override
    public Role findRoleById(Long id) {
        return roleDao.findRoleById(id);
    }


}
