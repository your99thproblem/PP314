package Rest.service;

import Rest.model.User;

import java.util.Map;

public interface JsonParseService {
    public User parseToUser(Map map);
}
