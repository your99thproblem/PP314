package Rest.dao;

import Rest.model.Role;

import java.util.List;

public interface RoleDao {
    public List<Role> findAll();

    public Role findRoleById(Long id);
    public void saveRole(Role role);
    public Role findByRoleName(String roleName);

}
