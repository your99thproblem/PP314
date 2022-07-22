package Rest.service;

import Rest.model.Role;

import java.util.List;

public interface RoleService {
    public List<Role> selectAllRoles();

    public void saveRole(Role role);

    public Role findByRoleName(String roleName);
    public Role findRoleById(Long id);
}