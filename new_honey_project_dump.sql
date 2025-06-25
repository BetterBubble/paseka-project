-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: myhoneydb
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add Категория',7,'add_category'),(26,'Can change Категория',7,'change_category'),(27,'Can delete Категория',7,'delete_category'),(28,'Can view Категория',7,'view_category'),(29,'Can add Производитель',8,'add_manufacturer'),(30,'Can change Производитель',8,'change_manufacturer'),(31,'Can delete Производитель',8,'delete_manufacturer'),(32,'Can view Производитель',8,'view_manufacturer'),(33,'Can add Регион',9,'add_region'),(34,'Can change Регион',9,'change_region'),(35,'Can delete Регион',9,'delete_region'),(36,'Can view Регион',9,'view_region'),(37,'Can add Товар',10,'add_product'),(38,'Can change Товар',10,'change_product'),(39,'Can delete Товар',10,'delete_product'),(40,'Can view Товар',10,'view_product'),(41,'Can add Способ доставки',11,'add_deliverymethod'),(42,'Can change Способ доставки',11,'change_deliverymethod'),(43,'Can delete Способ доставки',11,'delete_deliverymethod'),(44,'Can view Способ доставки',11,'view_deliverymethod'),(45,'Can add Заказ',12,'add_order'),(46,'Can change Заказ',12,'change_order'),(47,'Can delete Заказ',12,'delete_order'),(48,'Can view Заказ',12,'view_order'),(49,'Can add Товар в заказе',13,'add_orderitem'),(50,'Can change Товар в заказе',13,'change_orderitem'),(51,'Can delete Товар в заказе',13,'delete_orderitem'),(52,'Can view Товар в заказе',13,'view_orderitem'),(53,'Can add Отзыв',14,'add_review'),(54,'Can change Отзыв',14,'change_review'),(55,'Can delete Отзыв',14,'delete_review'),(56,'Can view Отзыв',14,'view_review'),(57,'Can add asexam',15,'add_asexam'),(58,'Can change asexam',15,'change_asexam'),(59,'Can delete asexam',15,'delete_asexam'),(60,'Can view asexam',15,'view_asexam'),(61,'Can add Сообщение',16,'add_contact'),(62,'Can change Сообщение',16,'change_contact'),(63,'Can delete Сообщение',16,'delete_contact'),(64,'Can view Сообщение',16,'view_contact'),(65,'Can add Обратная связь',17,'add_feedback'),(66,'Can change Обратная связь',17,'change_feedback'),(67,'Can delete Обратная связь',17,'delete_feedback'),(68,'Can view Обратная связь',17,'view_feedback'),(69,'Can add Корзина',18,'add_cart'),(70,'Can change Корзина',18,'change_cart'),(71,'Can delete Корзина',18,'delete_cart'),(72,'Can view Корзина',18,'view_cart'),(73,'Can add Товар в корзине',19,'add_cartitem'),(74,'Can change Товар в корзине',19,'change_cartitem'),(75,'Can delete Товар в корзине',19,'delete_cartitem'),(76,'Can view Товар в корзине',19,'view_cartitem'),(77,'Can add auth token',20,'add_authtoken'),(78,'Can change auth token',20,'change_authtoken'),(79,'Can delete auth token',20,'delete_authtoken'),(80,'Can view auth token',20,'view_authtoken');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$870000$2F33VpM27upCWMvvw6XMkn$1XTtDf/SKS18+PK6ylVmI/vUmEPEBepxciS2rwmzDL4=','2025-06-24 08:15:42.655960',1,'bubble','Шульга','Александр Алексеевич','sasha_shulga228@bk.ru',1,1,'2025-06-02 11:40:47.337026'),(5,'pbkdf2_sha256$870000$TNxsLPyGe5MdwmnZvzFXv2$403ZjbboKbGQLEWvs+nHIUgerElRnI6/FMlB1/qIqUc=','2025-06-14 18:34:12.365519',0,'Александр','','','sasha_shulga1337@inbox.ru',0,1,'2025-06-14 18:27:16.119500'),(6,'pbkdf2_sha256$870000$74wyFNV6SHPLvDWg3q1Ijl$ehPbNPyYdIL5I91ml7N1h80jlIbfgvSqezt5DcHq4SE=',NULL,0,'testuser','','','test@test.com',0,1,'2025-06-17 02:24:50.492440');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2025-06-02 11:54:26.905392','1','Мёд',1,'[{\"added\": {}}]',7,1),(2,'2025-06-02 11:54:30.372647','2','Соты',1,'[{\"added\": {}}]',7,1),(3,'2025-06-02 11:54:34.030871','3','Прополис',1,'[{\"added\": {}}]',7,1),(4,'2025-06-02 11:54:40.591142','4','Пыльца',1,'[{\"added\": {}}]',7,1),(5,'2025-06-02 11:54:43.125346','5','Воск',1,'[{\"added\": {}}]',7,1),(6,'2025-06-02 11:55:02.567414','1','Пасека Бабла',1,'[{\"added\": {}}]',8,1),(7,'2025-06-02 11:55:27.586029','1','Кабардино-Балкарская Республика',1,'[{\"added\": {}}]',9,1),(8,'2025-06-02 11:56:45.250007','1','Лесной мёд',1,'[{\"added\": {}}]',10,1),(9,'2025-06-02 11:57:28.527057','2','Крем-мёд акациевый',1,'[{\"added\": {}}]',10,1),(10,'2025-06-02 11:58:01.167380','3','Мёд с ромашкой',1,'[{\"added\": {}}]',10,1),(11,'2025-06-02 11:58:39.843800','4','Майский мёд',1,'[{\"added\": {}}]',10,1),(12,'2025-06-02 11:59:11.299177','5','Гречишный мёд',1,'[{\"added\": {}}]',10,1),(13,'2025-06-02 11:59:55.717713','6','Тёмный липовый мёд',1,'[{\"added\": {}}]',10,1),(14,'2025-06-02 12:00:28.916228','7','Подсолнуховый мёд',1,'[{\"added\": {}}]',10,1),(15,'2025-06-02 12:01:04.471874','8','Мёд со сладким клевером',1,'[{\"added\": {}}]',10,1),(16,'2025-06-02 12:03:08.351994','9','Акациевые соты',1,'[{\"added\": {}}]',10,1),(17,'2025-06-02 12:03:59.436011','10','Липовые соты',1,'[{\"added\": {}}]',10,1),(18,'2025-06-02 12:04:37.325561','11','Цветочные соты',1,'[{\"added\": {}}]',10,1),(19,'2025-06-02 12:05:49.335019','12','Соты с мёдом',1,'[{\"added\": {}}]',10,1),(20,'2025-06-02 12:06:21.815324','13','Горные соты',1,'[{\"added\": {}}]',10,1),(21,'2025-06-02 12:06:54.692594','14','Гречишные соты',1,'[{\"added\": {}}]',10,1),(22,'2025-06-02 12:08:03.194499','15','Прополис очищенный',1,'[{\"added\": {}}]',10,1),(23,'2025-06-02 12:08:40.660777','16','Прополис в гранулах',1,'[{\"added\": {}}]',10,1),(24,'2025-06-02 12:09:13.459218','17','Настойка прополиса',1,'[{\"added\": {}}]',10,1),(25,'2025-06-02 12:09:42.630519','18','Прополисный брусок',1,'[{\"added\": {}}]',10,1),(26,'2025-06-02 12:10:08.926586','19','Прополис с мёдом',1,'[{\"added\": {}}]',10,1),(27,'2025-06-02 12:10:46.031507','20','Прополис в масле',1,'[{\"added\": {}}]',10,1),(28,'2025-06-02 12:11:47.360345','21','Пыльца цветочная',1,'[{\"added\": {}}]',10,1),(29,'2025-06-02 12:12:20.353360','22','Пыльца акациевая',1,'[{\"added\": {}}]',10,1),(30,'2025-06-02 12:13:08.732123','23','Натуральный пчелиный воск',1,'[{\"added\": {}}]',10,1),(31,'2025-06-02 12:13:43.162291','24','Воск с прополисом',1,'[{\"added\": {}}]',10,1),(32,'2025-06-16 00:07:17.250705','1','Кораблем',1,'[{\"added\": {}}]',11,1),(33,'2025-06-16 23:44:05.762142','3','Заказ #3 от bubble',3,'',12,1),(34,'2025-06-16 23:44:05.762229','2','Заказ #2 от bubble',3,'',12,1),(35,'2025-06-16 23:44:05.762257','1','Заказ #1 от bubble',3,'',12,1),(36,'2025-06-16 23:51:39.420135','4','Заказ #4 от bubble',2,'[{\"changed\": {\"fields\": [\"\\u0421\\u0443\\u043c\\u043c\\u0430\"]}}, {\"added\": {\"name\": \"\\u0422\\u043e\\u0432\\u0430\\u0440 \\u0432 \\u0437\\u0430\\u043a\\u0430\\u0437\\u0435\", \"object\": \"\\u041f\\u044b\\u043b\\u044c\\u0446\\u0430 \\u0446\\u0432\\u0435\\u0442\\u043e\\u0447\\u043d\\u0430\\u044f x2\"}}]',12,1),(37,'2025-06-16 23:52:10.542773','4','Заказ #4 от bubble',2,'[{\"added\": {\"name\": \"\\u0422\\u043e\\u0432\\u0430\\u0440 \\u0432 \\u0437\\u0430\\u043a\\u0430\\u0437\\u0435\", \"object\": \"\\u041f\\u0440\\u043e\\u043f\\u043e\\u043b\\u0438\\u0441 \\u0432 \\u0433\\u0440\\u0430\\u043d\\u0443\\u043b\\u0430\\u0445 x1\"}}]',12,1),(38,'2025-06-16 23:52:35.419086','4','Заказ #4 от bubble',2,'[{\"added\": {\"name\": \"\\u0422\\u043e\\u0432\\u0430\\u0440 \\u0432 \\u0437\\u0430\\u043a\\u0430\\u0437\\u0435\", \"object\": \"\\u041f\\u0440\\u043e\\u043f\\u043e\\u043b\\u0438\\u0441\\u043d\\u044b\\u0439 \\u0431\\u0440\\u0443\\u0441\\u043e\\u043a x20\"}}]',12,1),(39,'2025-06-18 08:51:34.158813','7','Заказ 7 от bubble',2,'[{\"changed\": {\"fields\": [\"Address\", \"Status\"]}}]',12,1),(40,'2025-06-18 19:09:50.545349','11','Заказ 11 от bubble',2,'[{\"changed\": {\"fields\": [\"\\u0410\\u0434\\u0440\\u0435\\u0441 \\u0434\\u043e\\u0441\\u0442\\u0430\\u0432\\u043a\\u0438\"]}}, {\"added\": {\"name\": \"\\u0422\\u043e\\u0432\\u0430\\u0440 \\u0432 \\u0437\\u0430\\u043a\\u0430\\u0437\\u0435\", \"object\": \"\\u0412\\u043e\\u0441\\u043a \\u0441 \\u043f\\u0440\\u043e\\u043f\\u043e\\u043b\\u0438\\u0441\\u043e\\u043c x5\"}}]',12,1),(41,'2025-06-19 13:29:47.516077','24','Воск с прополисОм',2,'[{\"changed\": {\"fields\": [\"\\u041d\\u0430\\u0437\\u0432\\u0430\\u043d\\u0438\\u0435 \\u0442\\u043e\\u0432\\u0430\\u0440\\u0430\"]}}]',10,1),(42,'2025-06-19 14:15:30.922131','2','Алтайский край',1,'[{\"added\": {}}]',9,1),(43,'2025-06-22 13:50:21.460028','12','Заказ 12 от Александр',1,'[{\"added\": {}}, {\"added\": {\"name\": \"\\u0422\\u043e\\u0432\\u0430\\u0440 \\u0432 \\u0437\\u0430\\u043a\\u0430\\u0437\\u0435\", \"object\": \"\\u0412\\u043e\\u0441\\u043a \\u0441 \\u043f\\u0440\\u043e\\u043f\\u043e\\u043b\\u0438\\u0441\\u041e\\u043c x3\"}}, {\"added\": {\"name\": \"\\u0422\\u043e\\u0432\\u0430\\u0440 \\u0432 \\u0437\\u0430\\u043a\\u0430\\u0437\\u0435\", \"object\": \"\\u041d\\u0430\\u0442\\u0443\\u0440\\u0430\\u043b\\u044c\\u043d\\u044b\\u0439 \\u043f\\u0447\\u0435\\u043b\\u0438\\u043d\\u044b\\u0439 \\u0432\\u043e\\u0441\\u043a x10\"}}]',12,1),(44,'2025-06-22 14:58:54.948477','25','Мега мед',1,'[{\"added\": {}}]',10,1),(45,'2025-06-22 15:19:30.011841','13','Заказ 13 от bubble',1,'[{\"added\": {}}, {\"added\": {\"name\": \"\\u0422\\u043e\\u0432\\u0430\\u0440 \\u0432 \\u0437\\u0430\\u043a\\u0430\\u0437\\u0435\", \"object\": \"\\u0412\\u043e\\u0441\\u043a \\u0441 \\u043f\\u0440\\u043e\\u043f\\u043e\\u043b\\u0438\\u0441\\u041e\\u043c x6\"}}]',12,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(6,'sessions','session'),(15,'shop','asexam'),(20,'shop','authtoken'),(18,'shop','cart'),(19,'shop','cartitem'),(7,'shop','category'),(16,'shop','contact'),(11,'shop','deliverymethod'),(17,'shop','feedback'),(8,'shop','manufacturer'),(12,'shop','order'),(13,'shop','orderitem'),(10,'shop','product'),(9,'shop','region'),(14,'shop','review');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-06-02 11:38:56.589858'),(2,'auth','0001_initial','2025-06-02 11:38:56.720789'),(3,'admin','0001_initial','2025-06-02 11:38:56.746022'),(4,'admin','0002_logentry_remove_auto_add','2025-06-02 11:38:56.750223'),(5,'admin','0003_logentry_add_action_flag_choices','2025-06-02 11:38:56.754529'),(6,'contenttypes','0002_remove_content_type_name','2025-06-02 11:38:56.778757'),(7,'auth','0002_alter_permission_name_max_length','2025-06-02 11:38:56.791042'),(8,'auth','0003_alter_user_email_max_length','2025-06-02 11:38:56.800216'),(9,'auth','0004_alter_user_username_opts','2025-06-02 11:38:56.805938'),(10,'auth','0005_alter_user_last_login_null','2025-06-02 11:38:56.818220'),(11,'auth','0006_require_contenttypes_0002','2025-06-02 11:38:56.818632'),(12,'auth','0007_alter_validators_add_error_messages','2025-06-02 11:38:56.821376'),(13,'auth','0008_alter_user_username_max_length','2025-06-02 11:38:56.834991'),(14,'auth','0009_alter_user_last_name_max_length','2025-06-02 11:38:56.861006'),(15,'auth','0010_alter_group_name_max_length','2025-06-02 11:38:56.868590'),(16,'auth','0011_update_proxy_permissions','2025-06-02 11:38:56.872334'),(17,'auth','0012_alter_user_first_name_max_length','2025-06-02 11:38:56.884961'),(18,'sessions','0001_initial','2025-06-02 11:38:56.891020'),(19,'shop','0001_initial','2025-06-02 11:38:56.931398'),(20,'shop','0002_deliverymethod_order_orderitem_review','2025-06-02 11:38:57.009286'),(21,'shop','0003_alter_product_category_alter_product_manufacturer_and_more','2025-06-02 11:38:57.101862'),(22,'shop','0004_alter_product_options_product_created_at','2025-06-02 11:38:57.115048'),(23,'shop','0005_product_product_type','2025-06-02 11:38:57.128129'),(24,'shop','0006_asexam','2025-06-02 11:38:57.157452'),(25,'shop','0007_contact_feedback','2025-06-02 18:51:57.820329'),(26,'shop','0008_order_products','2025-06-02 19:58:55.093418'),(27,'shop','0009_category_slug_product_available_product_slug_and_more','2025-06-14 12:43:13.499617'),(28,'shop','0010_alter_review_product','2025-06-14 12:43:59.140205'),(29,'shop','0011_authtoken','2025-06-14 18:48:30.958562'),(30,'shop','0012_manufacturer_website_product_manual','2025-06-15 23:51:08.877065'),(31,'shop','0013_remove_manufacturer_website_remove_product_manual_and_more','2025-06-16 22:57:30.540330'),(32,'shop','0014_allow_null_price_at_purchase','2025-06-16 23:49:56.336302'),(33,'shop','0015_add_filefield_urlfield_demo','2025-06-17 00:06:15.850953'),(34,'shop','0016_auto_20250617_0312','2025-06-17 03:15:13.878660'),(35,'shop','0017_alter_order_options_remove_order_delivery_address_and_more','2025-06-18 07:09:37.663208'),(36,'shop','0018_alter_order_options_order_total_cost','2025-06-18 07:39:16.401243'),(37,'shop','0019_order_full_name_alter_order_address','2025-06-18 09:38:23.704677');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('01hl53hk0b6ffezarohagpcms3olf65v','.eJxVjMsOwiAQRf-FtSEFhhlw6d5vIDymUjU0Ke3K-O_apAvd3nPOfYkQt7WGrfMSpiLOworT75ZifnDbQbnHdptlntu6TEnuijxol9e58PNyuH8HNfb6rRFJMxQYSTlSSEppz8YjGO-1dVaBo9ECMRplUi7ghsEDxkjsbUEU7w-VtzXz:1uQVb2:4nII8at7fcbeE7JlHzh9iMlX44Op164mhJXxqjXVjAw','2025-06-28 18:27:16.364827'),('1ecyxo0a44eoilz7gakcw6qjhr3v4xiw','eyJjYXJ0Ijp7fX0:1uRoZN:FO_JrkV3uVSOYp_Dq5FxcskbhGmo1vJgdZfxJKk-s8M','2025-06-19 08:54:57.853777'),('1w5prlupdfulr3ew2parlr4bdypo1fqt','eyJjYXJ0Ijp7fX0:1uRLPt:uTg02Y4GZZiwMLV3w0ivNJDbA9J5FPcFxQU9XipXhEs','2025-06-18 01:47:13.668399'),('25z198ucd0pxvt960ige0etu1r09qlq0','.eJxVjDEOwjAMRe-SGUVJnATMyM4ZIte2SAGlUtNOiLtDpQ6w_vfef5lC61LL2nUuo5iz8ebwuw3ED20bkDu122R5ass8DnZT7E67vU6iz8vu_h1U6vVbJ4neQUwn9YGYo8d4zM6hOAVJWSJIDgJKKESEGYmzECMG51MCMO8PyQE3ZA:1uQVPX:67YvBI5QULRQdo5Kde1OD0sUlRTG_CX9espFCiR0mpQ','2025-06-28 18:15:23.494498'),('2rw5rtzqaqgjjqskm30nhs6qg4athnic','eyJjYXJ0Ijp7fX0:1uQVLT:_O57zOGR3rhPSdrR4xh-y51VJtPKoCumKI4Af6bneXc','2025-06-28 18:11:11.316473'),('30u5nigbxxitierosl1ncniv63qrrchd','eyJjYXJ0Ijp7fX0:1uRKdN:tkO0rVpX5s7lnICgMSz3XNgF37q-fJQYKewRQQ6KdPA','2025-06-18 00:57:05.323744'),('3cpjcchst3tcu1poqzsem05xw2q9izkl','eyJjYXJ0Ijp7fX0:1uRL8K:di9gWAuqeYau9DQ8j3F6ahEgQNYsiJx0yISwaQnhehA','2025-06-18 01:29:04.061579'),('4fd43yv8y5po4l82xai0ckpck95sye36','eyJjYXJ0Ijp7IjIxIjp7InF1YW50aXR5IjoxLCJwcmljZSI6IjE5OTAuMDAifX19:1uRLhx:G9n56dJWk0zw1MIXntrtGPgxnyIAXdr_ajl121eV_Hc','2025-06-18 02:05:53.426935'),('4phk4utrzi71y1r3vyk701t90moryn0i','.eJxVjEEOwiAQRe_C2hBqGQZcuu8ZyACDVA0kpV0Z765NutDtf-_9l_C0rcVvnRc_J3ERgzj9boHig-sO0p3qrcnY6rrMQe6KPGiXU0v8vB7u30GhXr41okWnbQaXFUfMlG1ERzxyyghRQXQaHKswGGKjxxSCMupMZMElyCTeH_O4OIM:1uQVtu:Mvtkn_2YPzDoWFOJa3Ha6YUuHpKN4i5s_Itzf5kSzoE','2025-06-15 18:46:46.100039'),('4wh1zdifaiqx5dl39cy2l0zzrrtl4046','eyJjYXJ0Ijp7fX0:1uRL3R:-qP80Jms0Ga4G0yju-Sa62e07YoBrCeyHRRljxZG7N8','2025-06-18 01:24:01.146775'),('52yu735a4qkvg240gwqjp9m2li9sv8nc','.eJxVjEEOwiAQRe_C2hBqGQZcuu8ZyACDVA0kpV0Z765NutDtf-_9l_C0rcVvnRc_J3ERgzj9boHig-sO0p3qrcnY6rrMQe6KPGiXU0v8vB7u30GhXr41okWnbQaXFUfMlG1ERzxyyghRQXQaHKswGGKjxxSCMupMZMElyCTeH_O4OIM:1uQVfO:tC2KnyF1VFD-0C8KluT6_YBDV3Y2MWfHj322mE3L22U','2025-06-28 18:31:46.995373'),('5pbyuhojdoic5b820gsmrnqeidnwga5k','eyJjYXJ0Ijp7fX0:1uQVLz:i_wUpNt8ZhaBab3XgM9MwQC4GZ2CioIspE_yo1FASps','2025-06-28 18:11:43.412341'),('6vw6iugp5c6eptfex9cjbbs9m1fh0bn6','.eJxVjEEOwiAQRe_C2hBqGQZcuu8ZyACDVA0kpV0Z765NutDtf-_9l_C0rcVvnRc_J3ERgzj9boHig-sO0p3qrcnY6rrMQe6KPGiXU0v8vB7u30GhXr41okWnbQaXFUfMlG1ERzxyyghRQXQaHKswGGKjxxSCMupMZMElyCTeH_O4OIM:1uQVhQ:3e0rsKoFUD_2ysjf6H76gZjQlV9fRBsP7x0734wpMk4','2025-06-28 18:33:52.189485'),('7ioegm0vjd38ewfwo7kx3wsphrs8gr3o','eyJjYXJ0Ijp7fX0:1uRKq3:chxUYFT_MGUagVo8nFWjidbOrMFn4bmk1HteYMVJQbg','2025-06-18 01:10:11.862444'),('907dp6ngtrgrj9dgen13l5j4ur6swjbe','eyJjYXJ0Ijp7fX0:1uRL55:Jw5tvuOS_-SvpTMajIZ6hsZ2mdqUT0RRvAvvPKEVikU','2025-06-18 01:25:43.371552'),('9ltv8rqv96t2upl2a2g2y2k8h6iad5ci','eyJjYXJ0Ijp7fX0:1uRMHN:qH-4hMBNYfKbIqurZV5xkBU-r-0SkL_gwERcurAUtlg','2025-06-18 02:42:29.405573'),('9oj69utbgbfdtztqcvrx77yor2uyevlp','eyJjYXJ0Ijp7fX0:1uRL5t:1EtUuGyZ8Xr5Y-B2PP8YrF7KxY6pstcSUqAfOvRnioo','2025-06-18 01:26:33.009671'),('atme3mhrbr8yuxj2nn6vrx7yjhmpfrd6','eyJjYXJ0Ijp7fX0:1uRL3G:ckj_ORabK4ZHWofqYJGRWIEgw1qB8H4gqswkpXYWaI0','2025-06-18 01:23:50.116722'),('av1qy2xc191h6cbiwdxxbfjhsiyx62xu','eyJjYXJ0Ijp7fX0:1uRLi3:zqC-KhE93MYDbfb9jxbvIB4FZC3zrRxEcit7xrodQLw','2025-06-18 02:05:59.302830'),('bxdvasfponwwj04x1nrcog6w3ywt6g9b','.eJxVjEEOwiAQRe_C2hBqGQZcuu8ZyACDVA0kpV0Z765NutDtf-_9l_C0rcVvnRc_J3ERgzj9boHig-sO0p3qrcnY6rrMQe6KPGiXU0v8vB7u30GhXr41okWnbQaXFUfMlG1ERzxyyghRQXQaHKswGGKjxxSCMupMZMElyCTeH_O4OIM:1uQVlo:IqvqT7T6l0yuFId83ErpZvTKne-uXSaDKS8uiGohSq4','2025-06-28 18:38:24.983685'),('crybsk1qh7e60ukopjai0o5jhzoj1p1o','eyJjYXJ0Ijp7fX0:1uRKqG:rSvxk7hkPbOIafxTZKlW_B5dYDPisR9L6bcrnkmKqaw','2025-06-18 01:10:24.371539'),('dk4ud0yc5o8pgmvxprvlf2wj52c58zz1','eyJjYXJ0Ijp7fX0:1uRL37:KdK1_rA60wEEKaW8Lioec7N0weaS8MiTwHM4bIrdGNE','2025-06-18 01:23:41.630094'),('e1t3n4731fe2auj4fi8wgzfsxt98zi2k','eyJjYXJ0Ijp7fX0:1uRL55:Jw5tvuOS_-SvpTMajIZ6hsZ2mdqUT0RRvAvvPKEVikU','2025-06-18 01:25:43.342850'),('e8oa4w8ofvym4kadt7tdu8j4kd6gys1l','eyJjYXJ0Ijp7IjIzIjp7InF1YW50aXR5IjoxLCJwcmljZSI6IjE1OTAuMDAifX19:1uRLhu:GT3dOVKm2ncAsgcwl5MouJKbOm1Hz2nZEsPtAHGHyWc','2025-06-18 02:05:50.402249'),('ezqsgafon3lkdii4igjnd463p51ctetx','.eJxVjDsOgzAQBe-ydWSx2PGHMn3OgGzvOpBEWLJNhbh7gkRD9aQ3o9kg-tJg2PYbjH5t07hWLuNMMADC5Qs-fng5AL398soi5qWVOYhDESet4pmJv4_TvQQmX6cjeydExRgVS4PRaIe90vzfRGitkUqSYyQdpOLQsWXrul6nZJILxkvYfwfhOqo:1uTypS:FDUDtlyGgPBVBq9A7OArnqjJZIgMp_HXBRXCwKIkLCQ','2025-06-25 08:16:30.846269'),('f25cn8bqhs3zwypbnf8qsuueyvpwzjy2','eyJjYXJ0Ijp7fX0:1uRM0e:ecaOB6xSs6kaVLjsuuP2WTluJUF5TauTPVlMguDmQgk','2025-06-18 02:25:12.876893'),('f74xw2y1b6xuj99g1a818vub8euoknql','.eJxVjEEOwiAQRe_C2hBqGQZcuu8ZyACDVA0kpV0Z765NutDtf-_9l_C0rcVvnRc_J3ERgzj9boHig-sO0p3qrcnY6rrMQe6KPGiXU0v8vB7u30GhXr41okWnbQaXFUfMlG1ERzxyyghRQXQaHKswGGKjxxSCMupMZMElyCTeH_O4OIM:1uQVuQ:4apVss7419GNOMEO9ZZY7rK1KLGYyA4bPGJb9vaXjEI','2025-06-15 18:47:18.758069'),('fltbl5kwvasovfcdkiweh3rr0h730qii','eyJjYXJ0Ijp7fX0:1uRLTB:egxuJUqpzctQSJ-hq69J4exnwF89C2486BkzOLGmC-E','2025-06-18 01:50:37.847803'),('fw296xnq816roili8odm7z0afoemlz7d','eyJjYXJ0Ijp7fX0:1uRKjf:wAa6QwWJxwRwIEHauM6llFzExO2Be9uil4gbb7TCMis','2025-06-18 01:03:35.726000'),('fzclf7scmy8p0i01ex47wsl0ofo7gbdj','eyJjYXJ0Ijp7fX0:1uRL7m:RHnQybDw9oyn3rnzJa9uolS1KQjmdIApAY2_JZC85Rg','2025-06-18 01:28:30.532720'),('gb993jgdg85q71vgzwi64cfzg7rftce2','eyJjYXJ0Ijp7fX0:1uQVLY:2KXE_fKCnYF3rHnkYwGZ0kZmwmj_epE7CLyNlwjWDlU','2025-06-28 18:11:16.303851'),('gkf6uze3aj42dujacq12d1l9qunafrhe','.eJxVjEsOAiEQBe_C2hBo5KNL956BNN0gowaSYWZlvLtOMgvdvqp6LxFxXWpcR57jxOIsrDj8bgnpkdsG-I7t1iX1tsxTkpsidzrktXN-Xnb376DiqN8anM0MjkiB4gBGcbHBeiisOZDWeMIQAnhWRyYkX3I2DpIh49k5bcT7A98KN9A:1uQVgw:lfIflAvweuE0ZlvPEj6rdTud9KXSSFduMcXWZt2rfrE','2025-06-28 18:33:22.370116'),('h9vodcdrsqtvenj8vq87c5pbmcw1ib78','eyJjYXJ0Ijp7fX0:1uRKsn:7or_Uvyf6kiOT9RL_OchIy-wk19logoSbKi-hkQXUfU','2025-06-18 01:13:01.163830'),('hcw5tesrvegnh8qquap3jaazm8b5k5w6','eyJjYXJ0Ijp7fX0:1uRKw8:fq4pE20VPGVro1P9bQg6tRyg5wpAfuKpDqbm7m3CCBs','2025-06-18 01:16:28.729578'),('hptlbgm5oow5zf2u46qhe2w17dy98d05','eyJjYXJ0Ijp7fX0:1uRL83:KBkpT43u0mrr--6iaiDPOBqmI3lCFbw587T7q3o8if0','2025-06-18 01:28:47.865626'),('hrkp4neseqv2agep52plrwn0j01snyqk','.eJxVjEEOwiAQRe_C2hBqGQZcuu8ZyACDVA0kpV0Z765NutDtf-_9l_C0rcVvnRc_J3ERgzj9boHig-sO0p3qrcnY6rrMQe6KPGiXU0v8vB7u30GhXr41okWnbQaXFUfMlG1ERzxyyghRQXQaHKswGGKjxxSCMupMZMElyCTeH_O4OIM:1uQVtG:lsCTJvuvX9rE09edjUoDxGSE3GwfGoL54poOWPIIlwc','2025-06-15 18:46:06.409560'),('hv41dmgcuj7344xilvio5qpcpgmpmeke','eyJjYXJ0Ijp7fX0:1uRLAZ:_Z_nhich4uYbzzv9oh2mPHo-cT41ae4x4zwMP8w29wI','2025-06-18 01:31:23.092957'),('hyhmu9hrlowk2yjbejgrd3oe1ah7qb2l','.eJxVjEEOwiAQRe_C2hBqGQZcuu8ZyACDVA0kpV0Z765NutDtf-_9l_C0rcVvnRc_J3ERgzj9boHig-sO0p3qrcnY6rrMQe6KPGiXU0v8vB7u30GhXr41okWnbQaXFUfMlG1ERzxyyghRQXQaHKswGGKjxxSCMupMZMElyCTeH_O4OIM:1uQVlb:CXIkKjGA_oo8RYaFhuifygLvj2ZctZAX_0BDDPq3BR0','2025-06-28 18:38:11.169593'),('jjep89ihusp3txxido4jseor2bmzucjs','.eJxVjEEOwiAQRe_C2hBqGQZcuu8ZyACDVA0kpV0Z765NutDtf-_9l_C0rcVvnRc_J3ERgzj9boHig-sO0p3qrcnY6rrMQe6KPGiXU0v8vB7u30GhXr41okWnbQaXFUfMlG1ERzxyyghRQXQaHKswGGKjxxSCMupMZMElyCTeH_O4OIM:1uQVgo:RsmQM0McGw9TWK_b9aTaNuDRtwYq8zg0zlf00rVgQbo','2025-06-28 18:33:14.067283'),('jlu0pwnyr8wykl5nn3majh6r8ex6te63','eyJjYXJ0Ijp7fX0:1uRLC1:psmiT86uXAZdd_4UtQykxCWSavVBqTvNZtkxxnYHRBs','2025-06-18 01:32:53.706600'),('k5rs18zbydrb8wm7go75tuy0jxg0hmdb','eyJjYXJ0Ijp7fX0:1uRLhq:4bHWqUFomKBtnIpNnwni2sNETTKzELGaGfFxIOpcHEU','2025-06-18 02:05:46.300717'),('kwr5z1wv4wsr2s7a2rczvkkgf7g2yqcx','eyJjYXJ0Ijp7fX0:1uRLA6:gS2l98SwscXPx5dvmuop9cw3z23-5zOvO6qFvmUYoMw','2025-06-18 01:30:54.162922'),('m8fao1021e15roi4o5u85qmz2fqly7sd','eyJjYXJ0Ijp7fX0:1uRL9u:0AJPrvje3rZx7ZA0GZOJQ0LAD1lHydp8ojL99lzSJVE','2025-06-18 01:30:42.236467'),('o85ko13paiwm8l2gnreh46pem2zwbmph','eyJjYXJ0Ijp7fX0:1uN6t9:OVCZTVwVaEMGJBX7cZCp4OeXNcwGEzn6ueY4LI_iOnU','2025-06-19 09:27:55.459848'),('ppzt6nxwyxlg8iteklsorsdjiorh4vdg','eyJjYXJ0Ijp7fX0:1uRLAI:e6MSGJWHIrtes6trdX3fU4_GvJPOX_rKTW5DnupAYwY','2025-06-18 01:31:06.523526'),('prooqp2u9g5fh900va5nx45qjl5edfpq','eyJjYXJ0Ijp7fX0:1uRL8W:V4LVCv-TTNChAdUlFd4I3HwaBW_qK3naIUWxF16gxwg','2025-06-18 01:29:16.848110'),('pt64jaqr1r7sm8mtrrlupjadrdmof4er','eyJjYXJ0Ijp7fX0:1uRLeM:WS7xjQkQqwS7RC36tILirjPVYWoIHwgp3lblchjgY-g','2025-06-18 02:02:10.676721'),('qe5p5jeba4n36m2pctm9uj3gslxpnspv','eyJjYXJ0Ijp7fX0:1uRKpY:MH64HGVcCY9OUb-it2aXBMqc-nvJek1i2RKZ-qkUqLM','2025-06-18 01:09:40.148603'),('qe5zkjg56amx0u0hf564how5bm8uz48j','eyJjYXJ0Ijp7fX0:1uRL06:hkq-lKnLsh1vKv0X94o0-Tn3LBWyBhl0S7E_w_zZILg','2025-06-18 01:20:34.089639'),('qgfqe8j7svs0uftimq71ib26nwa57wdc','eyJjYXJ0Ijp7fX0:1uQVJ1:uoaeBLT2rk4Tgr72AqZxBH6Ix0FzHQ196THcNDl0j1Y','2025-06-28 18:08:39.624713'),('qjttsx7h30kr9e4e680dc8kej77vyl8n','eyJjYXJ0Ijp7fX0:1uRKvv:26Bs70qCC3IRuHU6INp__rpzv6dyIupBV3y1ffxuFsI','2025-06-18 01:16:15.249181'),('r1jecswlmq295r2b5hip24x24hcwa9xm','eyJjYXJ0Ijp7fX0:1uQVLe:HF1Umg3BI1fdQrAF9uj2hlg1mplQrTkVoSkdipNcAwQ','2025-06-28 18:11:22.019253'),('r969y3y3zlm0vl8y6bbq1p0ryc4bojvl','.eJxVjEEOwiAQRe_C2hBqGQZcuu8ZyACDVA0kpV0Z765NutDtf-_9l_C0rcVvnRc_J3ERgzj9boHig-sO0p3qrcnY6rrMQe6KPGiXU0v8vB7u30GhXr41okWnbQaXFUfMlG1ERzxyyghRQXQaHKswGGKjxxSCMupMZMElyCTeH_O4OIM:1uQVmW:SwZem4lykvb6iSA678IYjRTvfYp4QKS0_d4uXFRspsE','2025-06-28 18:39:08.620372'),('rlaz029rmkojcmdp5082pmmxrq20gwcb','.eJxVjEEOwiAQRe_C2hBqGQZcuu8ZyACDVA0kpV0Z765NutDtf-_9l_C0rcVvnRc_J3ERgzj9boHig-sO0p3qrcnY6rrMQe6KPGiXU0v8vB7u30GhXr41okWnbQaXFUfMlG1ERzxyyghRQXQaHKswGGKjxxSCMupMZMElyCTeH_O4OIM:1uQVpB:zL91GWGS733xo2nCT0F68pnzJAv4dn4X6tN1EMRJpuA','2025-06-15 18:41:53.365354'),('sb6utlck2mjzsnwhhl1vzyjwfbhfouhr','eyJjYXJ0Ijp7fX0:1uRLSi:CGP4RkLWSL3pevvwStuPiIyhh3-n3fFGFw2t2sFeGms','2025-06-18 01:50:08.927362'),('sih83h6ljxdlus1nc5n2w6sul094b1kd','eyJjYXJ0Ijp7fX0:1uRKq0:_9aKtdm7n3uQbTRNtd7HmyXhatr4Ib9tVENonYMsrTg','2025-06-18 01:10:08.226382'),('sm03fr6xltlk59se8263pojwq6eky7am','.eJxVjDsOgzAQBe-ydWSx2PGHMn3OgGzvOpBEWLJNhbh7gkRD9aQ3o9kg-tJg2PYbjH5t07hWLuNMMADC5Qs-fng5AL398soi5qWVOYhDESet4pmJv4_TvQQmX6cjeydExRgVS4PRaIe90vzfRGitkUqSYyQdpOLQsWXrul6nZJILxkvYfwfhOqo:1uSiti:Wy6MBCLfrU4wiGMCcg2Fej1pAotnOyQxxApTg_bI1rY','2025-06-21 21:03:42.699515'),('ug3171iv66j9jxw27g7nmmdste04cvy3','.eJxVjEsOAiEQBe_C2hBo5KNL956BNN0gowaSYWZlvLtOMgvdvqp6LxFxXWpcR57jxOIsrDj8bgnpkdsG-I7t1iX1tsxTkpsidzrktXN-Xnb376DiqN8anM0MjkiB4gBGcbHBeiisOZDWeMIQAnhWRyYkX3I2DpIh49k5bcT7A98KN9A:1uQVhk:vAphkfNNMxEJZXyERSMts51NfTOIy8oVW6fmEB8H3zY','2025-06-28 18:34:12.374336'),('v9f2teh1erxv22admcmwgssznf8a7ozt','eyJjYXJ0Ijp7fX0:1uRKp8:QmK6QxhE_VbdSGdKK2wfMJ7npdvyHLProSWBmkjNums','2025-06-18 01:09:14.088246'),('vgve0vfdwbrcqncg14jjckqt0dfnk6ad','eyJjYXJ0Ijp7IjE3Ijp7InF1YW50aXR5IjoxLCJwcmljZSI6IjI3OTAuMDAifX19:1uRLi0:5Ab1rJ6p43IDviY0vHn9iX2mO7-M2dqrjD2tGZUSLIk','2025-06-18 02:05:56.847212'),('vl8splbyhnh7b98wv36afu2rdgtg7efo','eyJjYXJ0Ijp7fX0:1uRM0P:RL4beuvBw9zlpUkILsyU4ECmsnL0yxauGz9d_9bnBbg','2025-06-18 02:24:57.373343'),('vtev8gd1bk85mb8r8k70mrimuajahauf','.eJxVjEsOAiEQBe_C2hBo5KNL956BNN0gowaSYWZlvLtOMgvdvqp6LxFxXWpcR57jxOIsrDj8bgnpkdsG-I7t1iX1tsxTkpsidzrktXN-Xnb376DiqN8anM0MjkiB4gBGcbHBeiisOZDWeMIQAnhWRyYkX3I2DpIh49k5bcT7A98KN9A:1uQVfY:USX_Y_jpQJQ17Q9b5srdesZxc6u_lWV1ACpQ09dig7Q','2025-06-28 18:31:56.032989'),('we9iudfx8vajxocaadsuj0nkc261gwoo','eyJjYXJ0Ijp7fX0:1uRKdN:tkO0rVpX5s7lnICgMSz3XNgF37q-fJQYKewRQQ6KdPA','2025-06-18 00:57:05.344111'),('wln9mjx0ytf3ohdtxigqwy3hapf1nm96','eyJjYXJ0Ijp7fX0:1uRKmY:VvwEkStC3JAu_cIQiNNJxZ9Hzt3jvt33gB1Szs6x0TE','2025-06-18 01:06:34.952384'),('wodpem38by2wj890w7ej212gyf51p9t7','.eJxVjEEOwiAQRe_C2hBqGQZcuu8ZyACDVA0kpV0Z765NutDtf-_9l_C0rcVvnRc_J3ERgzj9boHig-sO0p3qrcnY6rrMQe6KPGiXU0v8vB7u30GhXr41okWnbQaXFUfMlG1ERzxyyghRQXQaHKswGGKjxxSCMupMZMElyCTeH_O4OIM:1uQVlN:oBZRZBzM7ubi4vIkinkUBQpNwlmOtPTtpjASowrsLsU','2025-06-28 18:37:57.564827'),('x6sbnqxrpz4rlifarxs0j2vh5crezwoi','eyJjYXJ0Ijp7fX0:1uRL6q:XqNDg6NZ82H52um9URne70APWFQlNamMpIud3HRYSos','2025-06-18 01:27:32.146630'),('xcq4sb3nzc4ew64tyt2tuh3p9x253oni','eyJjYXJ0Ijp7fX0:1uRL8i:hyHW4mpNVlJnORJJiCSb-eGyeb3KdCWjUcHugRs1Px0','2025-06-18 01:29:28.188063'),('xx0qtvam8o4pxwdv6sx6zbiy3nawozyy','.eJxVjEEOwiAQRe_C2hBqGQZcuu8ZyACDVA0kpV0Z765NutDtf-_9l_C0rcVvnRc_J3ERgzj9boHig-sO0p3qrcnY6rrMQe6KPGiXU0v8vB7u30GhXr41okWnbQaXFUfMlG1ERzxyyghRQXQaHKswGGKjxxSCMupMZMElyCTeH_O4OIM:1uQVqL:DpthsZpkyDHFCNbfMEFwiwA5NKzEPHh6Y6wsE58nmdM','2025-06-15 18:43:05.266992'),('ycpkjj23p7bubt3j1qmh0bveaxnhxy0i','.eJxVjDsOwjAQBe_iGlk2_u1S0ucM1m7s4ACypTipEHeHSCmgfTPzXiLStpa49bzEOYmLsOL0uzGNj1x3kO5Ub02Ora7LzHJX5EG7HFrKz-vh_h0U6uVbEyGChpDATR4zm2AY0AXwDi1n5RKycVr7c1BmChkVAHtMBECarBfvD8T_Nuo:1uQVX0:M1PhZKWbRp_kVXgn3abzt-XfhnEiLKDhbNUiv_bKMfs','2025-06-28 18:23:06.298883'),('yp1q6kv59qagoq50j50fhcgwdmwtemhu','.eJxVjDsOgzAQBe-ydWSx2PGHMn3OgGzvOpBEWLJNhbh7gkRD9aQ3o9kg-tJg2PYbjH5t07hWLuNMMADC5Qs-fng5AL398soi5qWVOYhDESet4pmJv4_TvQQmX6cjeydExRgVS4PRaIe90vzfRGitkUqSYyQdpOLQsWXrul6nZJILxkvYfwfhOqo:1uTh59:ubZqy_ZIcacXwWBFlGWbX304pf75nJqJbx0xvv4gqBg','2025-06-24 13:19:31.682203'),('zrikw20wlte34jb797w52f2iipys35x8','eyJjYXJ0Ijp7fX0:1uRKsw:o2cI9v6vmc2LLr0DnpaSPxqJFD4OnDwy7IKOfioY-VQ','2025-06-18 01:13:10.113587'),('ztcac3f7fpbjl5r3uvwlk0fg7bu4bd9o','eyJjYXJ0Ijp7fX0:1uQVEx:BsAj4JM4dWOjjW80s0QezrG3sGZk0U32GD7_Fa1fpm8','2025-06-28 18:04:27.175776');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_auth_token`
--

DROP TABLE IF EXISTS `shop_auth_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_auth_token` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `shop_auth_token_user_id_132ba7c9_fk_auth_user_id` (`user_id`),
  CONSTRAINT `shop_auth_token_user_id_132ba7c9_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_auth_token`
--

LOCK TABLES `shop_auth_token` WRITE;
/*!40000 ALTER TABLE `shop_auth_token` DISABLE KEYS */;
INSERT INTO `shop_auth_token` VALUES (23,'ZQIUPqaUdeh3r41nGifARDTrtekLws8cc-55t3roJQo','2025-06-17 02:24:50.680959','2025-06-24 02:24:50.680888',6),(48,'QT31a82ASewej5GnRUc_cnAB0msyxuTPzKLyuEQTzH4','2025-06-24 08:15:54.433536','2025-07-01 08:15:54.433434',1);
/*!40000 ALTER TABLE `shop_auth_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_cart`
--

DROP TABLE IF EXISTS `shop_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_cart` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `shop_cart_user_id_27925ac6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_cart`
--

LOCK TABLES `shop_cart` WRITE;
/*!40000 ALTER TABLE `shop_cart` DISABLE KEYS */;
INSERT INTO `shop_cart` VALUES (1,'2025-06-14 18:58:34.011358',1),(2,'2025-06-17 02:25:05.253080',6);
/*!40000 ALTER TABLE `shop_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_cartitem`
--

DROP TABLE IF EXISTS `shop_cartitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_cartitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int unsigned NOT NULL,
  `cart_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shop_cartitem_cart_id_product_id_eacadbd7_uniq` (`cart_id`,`product_id`),
  KEY `shop_cartitem_product_id_09e4b7dd_fk_shop_product_id` (`product_id`),
  CONSTRAINT `shop_cartitem_cart_id_6bf1447e_fk_shop_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `shop_cart` (`id`),
  CONSTRAINT `shop_cartitem_product_id_09e4b7dd_fk_shop_product_id` FOREIGN KEY (`product_id`) REFERENCES `shop_product` (`id`),
  CONSTRAINT `shop_cartitem_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_cartitem`
--

LOCK TABLES `shop_cartitem` WRITE;
/*!40000 ALTER TABLE `shop_cartitem` DISABLE KEYS */;
INSERT INTO `shop_cartitem` VALUES (23,1,2,1),(24,2,2,2);
/*!40000 ALTER TABLE `shop_cartitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_category`
--

DROP TABLE IF EXISTS `shop_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_category_slug_4508178e` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_category`
--

LOCK TABLES `shop_category` WRITE;
/*!40000 ALTER TABLE `shop_category` DISABLE KEYS */;
INSERT INTO `shop_category` VALUES (1,'Мёд','Натуральный мёд высшего качества от наших пчёл. Собран с экологически чистых лугов и полей. Богат витаминами и микроэлементами, обладает уникальными целебными свойствами.','category-1'),(2,'Соты','Свежие пчелиные соты с натуральным мёдом. Содержат воск, прополис и пыльцу. Идеальны для укрепления иммунитета и поддержания здоровья.','category-2'),(3,'Прополис','Натуральный прополис - пчелиный клей с мощными антибактериальными и противовоспалительными свойствами. Используется в народной медицине для лечения и профилактики.','category-3'),(4,'Пыльца','Цветочная пыльца, собранная пчёлами с различных растений. Богата белками, витаминами и аминокислотами. Отличный источник энергии и питательных веществ.','category-4'),(5,'Воск','Натуральный пчелиный воск высокого качества. Используется в косметологии, медицине и быту. Обладает антисептическими и заживляющими свойствами.','category-5');
/*!40000 ALTER TABLE `shop_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_contact`
--

DROP TABLE IF EXISTS `shop_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_contact` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_processed` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_contact`
--

LOCK TABLES `shop_contact` WRITE;
/*!40000 ALTER TABLE `shop_contact` DISABLE KEYS */;
INSERT INTO `shop_contact` VALUES (1,'Саша Шульма','sasha_shulga228@bk.ru','sasha_shulga228@bk.ru','sasha_shulga228@bk.rusasha_shulga228@bk.rusasha_shulga228@bk.rusasha_shulga228@bk.ru','2025-06-18 18:26:01.295122',0),(2,'Александр Варя','sasha_shulga228@bk.ru','sasha_shulga228@bk.ru','sasha_shulga228@bk.rusasha_shulga228@bk.rusasha_shulga228@bk.rusasha_shulga228@bk.ru','2025-06-19 11:59:16.907334',0);
/*!40000 ALTER TABLE `shop_contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_deliverymethod`
--

DROP TABLE IF EXISTS `shop_deliverymethod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_deliverymethod` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cost_policy` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_deliverymethod`
--

LOCK TABLES `shop_deliverymethod` WRITE;
/*!40000 ALTER TABLE `shop_deliverymethod` DISABLE KEYS */;
INSERT INTO `shop_deliverymethod` VALUES (1,'Кораблем','100');
/*!40000 ALTER TABLE `shop_deliverymethod` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_feedback`
--

DROP TABLE IF EXISTS `shop_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_feedback` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `feedback_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_processed` tinyint(1) NOT NULL,
  `response` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `responded_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_feedback`
--

LOCK TABLES `shop_feedback` WRITE;
/*!40000 ALTER TABLE `shop_feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop_feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_manufacturer`
--

DROP TABLE IF EXISTS `shop_manufacturer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_manufacturer` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `website` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_manufacturer`
--

LOCK TABLES `shop_manufacturer` WRITE;
/*!40000 ALTER TABLE `shop_manufacturer` DISABLE KEYS */;
INSERT INTO `shop_manufacturer` VALUES (1,'Пасека Бабла','',NULL);
/*!40000 ALTER TABLE `shop_manufacturer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_order`
--

DROP TABLE IF EXISTS `shop_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_method_id` bigint DEFAULT NULL,
  `user_id` int NOT NULL,
  `address` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_cost` decimal(10,2) NOT NULL,
  `full_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_order_delivery_method_id_bd566c44_fk_shop_deliverymethod_id` (`delivery_method_id`),
  KEY `shop_order_user_id_00aba627_fk_auth_user_id` (`user_id`),
  CONSTRAINT `shop_order_delivery_method_id_bd566c44_fk_shop_deliverymethod_id` FOREIGN KEY (`delivery_method_id`) REFERENCES `shop_deliverymethod` (`id`),
  CONSTRAINT `shop_order_user_id_00aba627_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_order`
--

LOCK TABLES `shop_order` WRITE;
/*!40000 ALTER TABLE `shop_order` DISABLE KEYS */;
INSERT INTO `shop_order` VALUES (7,'2025-06-17 02:45:39.923204','processing',1,1,'патип',68510.00,''),(9,'2025-06-18 09:53:31.401654','pending',1,1,'',173630.00,'Москва ак как'),(11,'2025-06-18 19:09:14.363222','pending',1,1,'Москва, дом 14, 434',110820.00,'Александр Шульга'),(12,'2025-06-22 13:50:21.416232','shipped',1,5,'Серпухов, Серпуховская дом 13',0.00,'Максим Андрианов Константинович'),(13,'2025-06-22 15:19:30.006944','processing',1,1,'Москва, белгородская 71, 9',75000.00,'Шульга Александр Алексееивч'),(14,'2025-06-22 15:20:41.687050','pending',1,1,'',24370.00,'Мега Монстр Тритысячи'),(15,'2025-06-24 08:16:30.803508','pending',1,1,'',54590.00,'Федор Максимович Лейтинант');
/*!40000 ALTER TABLE `shop_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_orderitem`
--

DROP TABLE IF EXISTS `shop_orderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_orderitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int unsigned NOT NULL,
  `price_at_purchase` decimal(10,2) DEFAULT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_orderitem_order_id_2f1b00cf_fk_shop_order_id` (`order_id`),
  KEY `shop_orderitem_product_id_48153f22_fk_shop_product_id` (`product_id`),
  CONSTRAINT `shop_orderitem_order_id_2f1b00cf_fk_shop_order_id` FOREIGN KEY (`order_id`) REFERENCES `shop_order` (`id`),
  CONSTRAINT `shop_orderitem_product_id_48153f22_fk_shop_product_id` FOREIGN KEY (`product_id`) REFERENCES `shop_product` (`id`),
  CONSTRAINT `shop_orderitem_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_orderitem`
--

LOCK TABLES `shop_orderitem` WRITE;
/*!40000 ALTER TABLE `shop_orderitem` DISABLE KEYS */;
INSERT INTO `shop_orderitem` VALUES (15,4,7890.00,7,13),(16,5,7390.00,7,14),(22,7,2090.00,9,22),(23,100,1590.00,9,23),(26,2,6990.00,11,10),(27,2,6850.00,11,11),(28,4,7890.00,11,13),(29,5,7390.00,11,14),(30,7,2090.00,11,22),(31,5,1611.00,11,24),(32,3,2100.00,12,24),(33,10,3990.00,12,23),(34,5,15000.00,13,24),(37,1,2390.00,14,17),(38,4,1690.00,14,21),(39,5,2090.00,14,22),(40,3,1590.00,14,23),(41,5,7590.00,15,9),(42,1,7890.00,15,13),(43,1,1590.00,15,23),(44,4,1790.00,15,24);
/*!40000 ALTER TABLE `shop_orderitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_product`
--

DROP TABLE IF EXISTS `shop_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `stock_quantity` int unsigned NOT NULL,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` bigint NOT NULL,
  `manufacturer_id` bigint NOT NULL,
  `region_id` bigint NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `product_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `available` tinyint(1) NOT NULL,
  `slug` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime(6) NOT NULL,
  `manual` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_product_category_id_14d7eea8_fk_shop_category_id` (`category_id`),
  KEY `shop_product_manufacturer_id_aa6d23e4_fk_shop_manufacturer_id` (`manufacturer_id`),
  KEY `shop_product_region_id_0a65116c_fk_shop_region_id` (`region_id`),
  KEY `shop_product_slug_30bd2d5d` (`slug`),
  CONSTRAINT `shop_product_category_id_14d7eea8_fk_shop_category_id` FOREIGN KEY (`category_id`) REFERENCES `shop_category` (`id`),
  CONSTRAINT `shop_product_manufacturer_id_aa6d23e4_fk_shop_manufacturer_id` FOREIGN KEY (`manufacturer_id`) REFERENCES `shop_manufacturer` (`id`),
  CONSTRAINT `shop_product_region_id_0a65116c_fk_shop_region_id` FOREIGN KEY (`region_id`) REFERENCES `shop_region` (`id`),
  CONSTRAINT `shop_product_chk_1` CHECK ((`stock_quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_product`
--

LOCK TABLES `shop_product` WRITE;
/*!40000 ALTER TABLE `shop_product` DISABLE KEYS */;
INSERT INTO `shop_product` VALUES (1,'Лесной мёд','Тёмный, насыщенный мёд, собранный с дикорастущих лесных растений. Отличается терпким вкусом, высоким содержанием дубильных веществ и антиоксидантов. Рекомендуется при простудах и для укрепления иммунитета.',8290.00,7461.00,19,'products/Forest_honey_6_26cQrk2.png',1,1,1,'2025-06-02 11:55:44.000000','honey',1,'product-1','2025-06-17 01:10:00.824217',''),(2,'Крем-мёд акациевый','Нежный кремообразный мёд, приготовленный из акациевого сорта методом взбивания при низкой температуре. Подходит для детей и людей с чувствительным ЖКТ.',7490.00,6990.00,21,'products/Acacia_honey_cream_5_sRotbvA.png',1,1,1,'2025-06-02 11:56:45.000000','honey',1,'product-2','2025-06-14 12:43:31.040002',NULL),(3,'Мёд с ромашкой','Цветочный мёд с добавлением экстракта аптечной ромашки. Успокаивает слизистые, помогает при воспалении горла и кашле, улучшает сон.',7190.00,NULL,7,'products/Flower_honey_with_chamomile_4_YbMPDDM.png',1,1,1,'2025-06-02 11:57:28.000000','honey',1,'product-3','2025-06-14 12:43:31.039450',NULL),(4,'Майский мёд','Самый первый мёд сезона, собранный в мае. Имеет светлый цвет и приятный цветочный аромат. Богат витаминами группы B и естественными сахарами.',6990.00,3990.00,13,'products/May_honey_3_e0CXEOz.png',1,1,1,'2025-06-02 11:58:01.000000','honey',1,'product-4','2025-06-14 12:43:31.038785',NULL),(5,'Гречишный мёд','Сорт мёда с характерным тёмным цветом и насыщенным ароматом гречки. Содержит много железа, применяется при анемии и истощении.',7890.00,7101.00,31,'products/Buckwheat_honey_2_FULwMYu.png',1,1,1,'2025-06-02 11:58:39.000000','honey',1,'product-5','2025-06-17 01:06:24.470739',''),(6,'Тёмный липовый мёд','Уникальный сорт липового мёда, собранный в вечерние часы. Имеет янтарный цвет, противовоспалительные и жаропонижающие свойства.',7990.00,6490.00,11,'products/Dark_lime_honey_1_dnuXNdB.png',1,1,1,'2025-06-02 11:59:11.000000','honey',1,'product-6','2025-06-14 12:43:31.037691',NULL),(7,'Подсолнуховый мёд','Золотисто-жёлтый мёд с подсолнечника, быстро кристаллизуется. Имеет высокий уровень глюкозы, отлично подходит для энергетического восстановления.',6990.00,NULL,3,'products/Sunflower_honey_7_qZs5cKf.png',1,1,1,'2025-06-02 11:59:55.000000','honey',1,'product-7','2025-06-14 12:43:31.036816',NULL),(8,'Мёд со сладким клевером','Ароматный мёд с нотами ванили и пряности. Полезен при стрессах, обладает мягким седативным эффектом.',7390.00,NULL,4,'products/Sweet_clover_honey_8_zwtzZfY.png',1,1,1,'2025-06-02 12:00:28.000000','honey',1,'product-8','2025-06-14 12:43:31.036312',NULL),(9,'Акациевые соты','Соты с акациевым мёдом, собранные вручную. Обладают нежным вкусом и тонким ароматом акации. Подходят для десертов и натурального употребления.',7590.00,NULL,23,'products/acacia_honeycombs_1_3afTD4l.png',2,1,1,'2025-06-02 12:01:04.000000','comb',1,'product-9','2025-06-17 01:26:23.435655',''),(10,'Липовые соты','Натуральные соты, наполненные липовым мёдом. Отличаются насыщенным вкусом и противовоспалительными свойствами.',7490.00,6990.00,20,'products/linden_honeycombs_2_ZPuaqqW.png',2,1,1,'2025-06-02 12:03:08.000000','comb',1,'product-10','2025-06-14 12:43:31.034667',NULL),(11,'Цветочные соты','Ароматные соты с цветочным мёдом. Многообразие нектаров делает вкус насыщенным, идеально подходят для иммуноподдержки.',7350.00,6850.00,18,'products/flower_honeycombs_3_EdrNI7T.png',2,1,1,'2025-06-02 12:03:59.000000','comb',1,'product-11','2025-06-14 12:43:31.034003',NULL),(12,'Соты с мёдом','Классические соты, наполненные тягучим мёдом. Продукт прямого среза, сохраняет максимальные питательные свойства.',7690.00,7090.00,15,'products/honey_filled_combs_4_B5eoDhC.png',2,1,1,'2025-06-02 12:04:37.000000','comb',1,'product-12','2025-06-14 12:43:31.033150',NULL),(13,'Горные соты','Соты, собранные в горных пасеках. Содержат мёд из редких высокогорных трав. Богаты антиоксидантами и микроэлементами.',7890.00,NULL,13,'products/mountain_honeycombs_5_lDzHz0d.png',2,1,1,'2025-06-02 12:05:49.000000','comb',1,'product-13','2025-06-17 01:26:23.432095',''),(14,'Гречишные соты','Соты с тёмным и насыщенным гречишным мёдом. Укрепляют сосуды, обладают мощным антибактериальным эффектом.',7390.00,NULL,5,'products/buckwheat_honeycombs_6_8XNatHV.png',2,1,1,'2025-06-02 12:06:21.000000','comb',1,'product-14','2025-06-17 01:32:48.968773',''),(15,'Прополис очищенный','Натуральный очищенный пчелиный прополис. Используется в домашней медицине и косметологии. Обладает мощными антисептическими и противогрибковыми свойствами.',2390.00,1990.00,32,'products/purified_propolis_1_E1z0KHH.png',3,1,1,'2025-06-02 12:06:54.000000','propolis',1,'product-15','2025-06-14 12:43:31.030667',NULL),(16,'Прополис в гранулах','Удобный формат прополиса для настоек и жевания. Укрепляет иммунитет, помогает при воспалениях и респираторных заболеваниях.',2590.00,2190.00,27,'products/granulated_propolis_2_9m8ZOia.png',3,1,1,'2025-06-02 12:08:03.000000','propolis',1,'product-16','2025-06-14 12:43:31.030005',NULL),(17,'Настойка прополиса','Спиртовая настойка 20%. Универсальное средство от простуд, для полоскания горла, ингаляций и наружного применения.',2790.00,2390.00,25,'products/propolis_tincture_3_lTgYMMX.png',3,1,1,'2025-06-02 12:08:40.000000','propolis',1,'product-17','2025-06-14 12:43:31.029320',NULL),(18,'Прополисный брусок','Твёрдый брусок прополиса. Используется для натираний, ингаляций и создания домашних лечебных мазей.',2290.00,1890.00,21,'products/propolis_block_4_ftTa2M2.png',3,1,1,'2025-06-02 12:09:13.000000','propolis',1,'product-18','2025-06-14 12:43:31.028608',NULL),(19,'Прополис с мёдом','Смесь мёда и прополиса. Отличный иммуностимулятор. Подходит для употребления в чистом виде или с тёплой водой.',3190.00,NULL,10,'products/propolis_honey_mix_5_3YXdDZH.png',3,1,1,'2025-06-02 12:09:42.000000','propolis',1,'product-19','2025-06-14 12:43:31.027904',NULL),(20,'Прополис в масле','Прополис, настоянный на натуральном масле. Идеален для ухода за кожей, лечения ран, ожогов и дерматитов.',2690.00,2290.00,24,'products/propolis_oil_6_vJmrHtv.png',3,1,1,'2025-06-02 12:10:08.000000','propolis',1,'product-20','2025-06-14 12:43:31.027194',NULL),(21,'Пыльца цветочная','Богатый источник витаминов и аминокислот. Улучшает обмен веществ, повышает уровень энергии и выносливость.',1990.00,1690.00,10,'products/flower_pollen_1_gMexDw7.png',4,1,1,'2025-06-02 12:10:46.000000','bee_pollen',1,'product-21','2025-06-14 12:43:31.026546',NULL),(22,'Пыльца акациевая','Светлая, мягкая по вкусу пыльца. Рекомендуется для ежедневного приёма. Укрепляет иммунитет и способствует восстановлению организма.',2090.00,NULL,28,'products/acacia_pollen_2_h4gWNmW.png',4,1,1,'2025-06-02 12:11:47.000000','bee_pollen',1,'product-22','2025-06-18 08:52:16.430285',''),(23,'Натуральный пчелиный воск','Чистый, неотбеленный воск, идеально подходит для изготовления свечей, косметических и медицинских средств.',1590.00,NULL,35,'products/natural_beeswax_1_npo1cw2.png',5,1,1,'2025-06-02 12:12:20.000000','wax',1,'product-23','2025-06-17 03:54:44.301906',''),(24,'Воск с прополисОм','Обогащённый прополисом воск. Имеет антибактериальные свойства, подходит для бальзамов и мазей.',1790.00,NULL,51,'products/propolis_beeswax_2_uOqEG5V.png',5,1,1,'2025-06-02 12:13:08.000000','wax',1,'product-24','2025-06-19 13:29:47.512316',''),(25,'Мега мед','тестовый продукт',3000.00,2700.00,200,'',1,1,2,'2025-06-22 14:58:54.934009','honey',1,'mega-med','2025-06-22 15:00:19.500415','');
/*!40000 ALTER TABLE `shop_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_region`
--

DROP TABLE IF EXISTS `shop_region`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_region` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_region`
--

LOCK TABLES `shop_region` WRITE;
/*!40000 ALTER TABLE `shop_region` DISABLE KEYS */;
INSERT INTO `shop_region` VALUES (1,'Кабардино-Балкарская Республика'),(2,'Алтайский край');
/*!40000 ALTER TABLE `shop_region` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_review`
--

DROP TABLE IF EXISTS `shop_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_review` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `rating` int NOT NULL,
  `comment` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_review_product_id_f74dddfd_fk_shop_product_id` (`product_id`),
  KEY `shop_review_user_id_02dce754_fk_auth_user_id` (`user_id`),
  CONSTRAINT `shop_review_product_id_f74dddfd_fk_shop_product_id` FOREIGN KEY (`product_id`) REFERENCES `shop_product` (`id`),
  CONSTRAINT `shop_review_user_id_02dce754_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_review`
--

LOCK TABLES `shop_review` WRITE;
/*!40000 ALTER TABLE `shop_review` DISABLE KEYS */;
INSERT INTO `shop_review` VALUES (1,5,'Супер пупер мега дупер','2025-06-02 16:47:38.157303',16,1),(2,4,'Мне нравится все, очень вкусный','2025-06-19 15:54:57.090863',7,1),(3,5,'вообще норм мед','2025-06-19 15:57:01.792063',7,1),(4,5,'супер, нравится','2025-06-19 15:59:17.119443',1,1);
/*!40000 ALTER TABLE `shop_review` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-24 11:18:51
