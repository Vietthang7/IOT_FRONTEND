<template>
  <div class="profile-container">
    <div class="profile-card">
      <h1 class="profile-title">My profile</h1>
      
      <div class="profile-content">
        <div class="avatar-section">
          <img src="/img/obito.jpg" alt="Profile Avatar" class="avatar" />
        </div>
        
        <div class="info-section">
          <div class="info-item">
            <span class="label">Họ tên:</span>
            <span class="value">Nguyễn Viết Thắng</span>
          </div>
          
          <div class="info-item">
            <span class="label">Mã sinh viên:</span>
            <span class="value">B22DCCN815</span>
          </div>
          
          <div class="info-item">
            <span class="label">IOT Class:</span>
            <span class="value">IOT-15</span>
          </div>
          
          <div class="info-item">
            <span class="label">Github Link:</span>
            <a href="https://github.com/inet-corp/simv2-backend" target="_blank" class="link">
              https://github.com/inet-corp/simv2-backend
            </a>
          </div>
          
          <div class="info-item">
            <span class="label">PDF LINK</span>
          </div>
          
          <div class="info-item">
            <span class="label">Api Docs :</span>
            <span class="value">Postman Document</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage'
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.profile-card {
  background: #3949ab;
  border-radius: 20px;
  padding: 40px;
  max-width: 800px;
  width: 100%;
  color: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.profile-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 40px;
  font-weight: 300;
}

.profile-content {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.avatar-section {
  flex-shrink: 0;
}

.avatar {
  width: 200px;
  height: 200px;
  border-radius: 15px;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.label {
  font-size: 1.1rem;
  font-weight: 500;
  opacity: 0.9;
}

.value {
  font-size: 1.2rem;
  font-weight: 300;
}

.link {
  color: #81c784;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.link:hover {
  color: #a5d6a7;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar {
    width: 150px;
    height: 150px;
  }
  
  .profile-title {
    font-size: 2rem;
  }
}
</style>