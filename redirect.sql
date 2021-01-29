TRUNCATE TABLE groupbasket_redirect;
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('COURRIER', 'QualificationBasket', 18, '', 'ALL_ENTITIES', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('COURRIER', 'NumericBasket', 18, '', 'ALL_ENTITIES', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('AGENT', 'MyBasket', 1, '', 'MY_ENTITIES', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('AGENT', 'MyBasket', 1, '', 'ENTITIES_BELOW', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('AGENT', 'MyBasket', 1, '', 'ENTITIES_JUST_UP', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('AGENT', 'MyBasket', 1, '', 'SAME_LEVEL_ENTITIES', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('AGENT', 'MyBasket', 1, '', 'MY_ENTITIES', 'USERS');

INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('RESPONSABLE', 'MyBasket', 1, '', 'MY_ENTITIES', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('RESPONSABLE', 'MyBasket', 1, '', 'ENTITIES_BELOW', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('RESPONSABLE', 'MyBasket', 1, '', 'ENTITIES_JUST_UP', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('RESPONSABLE', 'MyBasket', 1, '', 'SAME_LEVEL_ENTITIES', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('RESPONSABLE', 'MyBasket', 1, '', 'MY_ENTITIES', 'USERS');

INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('RESPONSABLE', 'DepartmentBasket', 1, '', 'MY_ENTITIES', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('RESPONSABLE', 'DepartmentBasket', 1, '', 'ENTITIES_BELOW', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('RESPONSABLE', 'DepartmentBasket', 1, '', 'ENTITIES_JUST_UP', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('RESPONSABLE', 'DepartmentBasket', 1, '', 'SAME_LEVEL_ENTITIES', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('RESPONSABLE', 'DepartmentBasket', 1, '', 'MY_ENTITIES', 'USERS');

INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('ELU', 'MyBasket', 1, '', 'ALL_ENTITIES', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('AGENT', 'MyBasket', 1, '', 'ALL_ENTITIES', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('AGENT', 'DepartmentBasket', 1, '', 'ALL_ENTITIES', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('RESPONSABLE', 'MyBasket', 1, '', 'ALL_ENTITIES', 'ENTITY');
INSERT INTO groupbasket_redirect (group_id, basket_id, action_id, entity_id, keyword, redirect_mode) VALUES ('RESPONSABLE', 'DepartmentBasket', 1, '', 'ALL_ENTITIES', 'ENTITY');
Select setval('groupbasket_redirect_system_id_seq', (select max(system_id)+1 from groupbasket_redirect), false);
