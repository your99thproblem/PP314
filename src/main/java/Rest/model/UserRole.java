package Rest.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import java.util.Objects;

@Entity(name = "UserRole")
@Table(name = "user_role")
public class UserRole {
    @EmbeddedId
    private UserRoleId id;
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("roleId")
    private Role role;

    public Role getRole() {
        return role;
    }
    public UserRole() {

    }
    public UserRole(User user, Role role) {
        this.user = user;
        this.role = role;
        this.id = new UserRoleId(user.getId(), role.getId());
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserRole userRole = (UserRole) o;
        return user.equals(userRole.user) && role.equals(userRole.role);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, role);
    }
}
