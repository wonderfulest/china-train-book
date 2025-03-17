<template>
  <div class="container">
  <div class="search-params-display" @click="showSearchCard = true">
    <div class="date-info">
      <Icon icon="ic:round-arrow-left" width="24" height="24" style="color: var(--el-button-primary-background)" />
      <span class="date-text">{{ formatDate(date) }}</span>
      <Icon icon="ic:round-arrow-right" width="24" height="24" style="color: var(--el-button-primary-background)" />
    </div>
    <div class="route-info">
      <span class="city">{{ fromStation?.label || "From" }}</span>
      <span class="direction-icon">→</span>
      <span class="city">{{ toStation?.label || "To" }}</span>
    </div>
    <div class="edit-icon">
      <Icon icon="material-symbols:edit" width="16" height="16" style="color: var(--el-button-primary-background)" />
      <span style="color: var(--el-button-primary-background)">Edit</span>
    </div>
  </div>
  <!-- 搜索卡片弹出层 -->
  <div v-if="showSearchCard" class="search-card-overlay" @click="showSearchCard = false">
    <div class="search-card-container" @click.stop>
      <SearchCard @search="handleSearchCardSubmit" width="100%" height="auto" />
    </div>
  </div>
  <!-- 搜索结果 -->
  <div class="search-results">
    <!-- <div class="sort-section">
      <span class="result-count">{{ trains.length }} results sorted by</span>
      <div class="sort-options">
        <div class="sort-option" :class="{ active: sortBy === 'fromTime' }" @click="setSortOption('fromTime')">
          Departure time
          <Icon :icon="sortBy === 'fromTime' ? (sortDirection === 'asc' ? 'mdi:arrow-up' : 'mdi:arrow-down') : 'mdi:arrow-down'" width="16" height="16" />
        </div>
        <div class="sort-option" :class="{ active: sortBy === 'travelTime' }" @click="setSortOption('travelTime')">
          Travel time
          <Icon :icon="sortBy === 'travelTime' ? (sortDirection === 'asc' ? 'mdi:arrow-up' : 'mdi:arrow-down') : 'mdi:arrow-down'" width="16" height="16" />
        </div>
        <div class="sort-option" :class="{ active: sortBy === 'price' }" @click="setSortOption('price')">
          Price
          <Icon :icon="sortBy === 'price' ? (sortDirection === 'asc' ? 'mdi:arrow-up' : 'mdi:arrow-down') : 'mdi:arrow-down'" width="16" height="16" />
        </div>
      </div>
    </div> -->

    <div class="results-list">
      <el-empty v-if="!loading && trains.length === 0" description="No trains found" />
      <template v-if="!loading && trains.length > 0">
        <div v-for="train in trains" :key="train.id" class="train-card" :class="{ expanded: train.expanded }">
          <div class="train-item">
            <!-- Departure information -->
            <div class="col departure-section">
              <div class="time-large">{{ train.fromTime }}</div>
              <div class="station">{{ formatStation(train.fromStation, allCities) }}</div>
            </div>

            <!-- Connection line with distance -->
            <div class="col connection-section">
              <div class="distance">{{ formatDuration(train.runTime) }}</div>
              <div class="connection-line">
                <div class="connection-dot start"></div>
                <div class="connection-dot end"></div>
              </div>
            </div>

            <!-- Arrival information -->
            <div class="col arrival-section">
              <div class="time-large">{{ train.toTime }}</div>
              <div class="station">{{ formatStation(train.toStation, allCities) }}</div>
            </div>

            <!-- Train type info -->
            <div class="train-info-section">
              <div class="train-type-tag">BULLET TRAIN</div>
              <div class="train-number">Train #{{ train.number }}</div>
            </div>

            <!-- Price section as separate column -->
            <div class="price-section-column">
              <div class="from-price">
                from <span class="price-value">{{ currencySymbol }}{{ currencyStore.convertPrice(train.minPrice) || "--" }}</span>
              </div>
              <div class="train-date">{{ formatDate(date) }}</div>
            </div>

            <!-- Select Seats / Cancel button as separate column -->
            <div class="action-column">
              <el-button :type="train.expanded ? 'danger' : 'primary'" :class="['action-btn', train.expanded ? 'cancel-btn' : 'select-seats-btn']" @click="train.expanded ? (train.expanded = false) : expandDetails(train)">
                {{ train.expanded ? "Cancel" : "Select Seats" }}
              </el-button>
            </div>
          </div>

          <!-- Inline train details section -->
          <div v-if="train.expanded" class="inline-train-details">
            <div class="dialog-important-note">
              <strong>IMPORTANT:</strong> Boarding pass should be redeemed in ticket machine at the train station. Child tickets are available for children less than 1.5m in height. Infants less than 1.2m in height can travel for free without own
              seat or bed.
            </div>

            <div class="dialog-content">
              <div class="dialog-seat-selection-layout">
                <!-- Left side: Seat image container -->
                <div class="dialog-seat-image-container">
                  <img :src="selectedSeatImage" alt="Seat image" class="dialog-seat-image" />
                  <div class="dialog-seat-description">
                    This is the most comfortable and top-notch travel class onboard the high-speed Fuxing Hao train.
                    <a href="#" class="show-more-link">Show more</a>
                  </div>
                  <div class="dialog-image-navigation">
                    <button class="nav-button prev" @click="prevSeatImage"><i class="el-icon-arrow-left"></i></button>
                    <button class="nav-button next" @click="nextSeatImage"><i class="el-icon-arrow-right"></i></button>
                  </div>
                </div>

                <!-- Right side: Seat options -->
                <div class="dialog-seat-options">

                  <div v-for="(seat, index) in train.seats" :key="seat.type" class="dialog-seat-option" :class="{ selected: selectedSeatIndex === index }" @click="selectSeat(index)">
                    <div class="dialog-seat-info">
                      <div class="dialog-seat-type">{{ seat.type }}</div>
                      <div class="dialog-seat-amenities">
                        <img v-for="amenity in seat.amenities" :key="amenity" :src="`/src/assets/amenities/${amenity}.png`" :alt="amenity" class="dialog-amenity-icon" />
                      </div>
                    </div>

                    <div class="dialog-seat-price-section" :class="{ 'selected-price-section': selectedSeatIndex === index }">
                      <div class="dialog-price">
                        <div class="dialog-price-currency">{{ currencySymbol }}</div>
                        <div class="dialog-price-amount"> {{ currencyStore.convertPrice(seat.seatPriceTotal) }}</div>
                      </div>
                      <div class="dialog-per-seat">Per seat</div>
                      <el-button v-if="selectedSeatIndex === index" type="primary" class="dialog-book-btn" @click="submitTrainSeat(train, seat)">Book</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="dialog-footer">
              <div class="dialog-total">
                Total amount for 1 passenger: <span class="dialog-total-price">{{ currencySymbol }}{{ selectedSeatIndex >= 0 && train.seats ? currencyStore.convertPrice(train.seats[selectedSeatIndex].seatPriceTotal) : currencyStore.convertPrice(train.minPrice) }}</span>
              </div>
              <el-button type="primary" class="dialog-continue-btn" @click="submitTrainSeat(train, selectedSeatIndex >= 0 && train.seats ? train.seats[selectedSeatIndex] : train.seats[0])"> Continue <i class="el-icon-arrow-right"></i> </el-button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { formatDuration, formatStation } from "@/utils/formatters";
import { format } from "date-fns";
import { useBookingStore } from "@/stores/bookingProcess";
import { Switch, Location, Close, Edit } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElLoading } from "element-plus";
import { getOrderTimetable, updateOrderTrainSeat } from "@/api/modules/orders";
import { getExchangeRate } from "@/api/modules/exchange";
import { useCityStore } from "@/stores/city";
import { useCurrencyStore } from "@/stores/currencyStore";
import { storeToRefs } from "pinia";
import SearchCard from "./SearchCard.vue";
const route = useRoute();
const router = useRouter();
const cityStore = useCityStore();
const currencyStore = useCurrencyStore();
const { allCities } = storeToRefs(cityStore);
const { currency, currencySymbol } = storeToRefs(currencyStore);

// 设置当前步骤为Timetable阶段（索引为1）
const bookingStore = useBookingStore();

const from = ref("");
const to = ref("");
const fromStation = ref(null);
const toStation = ref(null);

const date = ref("");
const trains = ref([]);
const loading = ref(false);

const selectedTrain = ref(null);
const selectedSeatIndex = ref(0);
const currentImageIndex = ref(0);
const showSearchCard = ref(false);

onMounted(async() => {
  await initialize();

  bookingStore.setActiveStep(1);

  // 保存搜索参数到store
  bookingStore.setSearchParams({
    from: from.value,
    to: to.value,
    date: date.value,
  });
});

// Watch for route query changes
watch(
  () => route.query,
  (newQuery) => {
    const shouldSearch = Object.keys(newQuery).length > 0;

    if (newQuery.from) {
      const station = allCities.value.find((c) => c.stationCode === newQuery.from);
      if (station) {
        fromStation.value = station;
        from.value = station.value;
      }
    }

    if (newQuery.to) {
      const station = allCities.value.find((c) => c.stationCode === newQuery.to);
      if (station) {
        toStation.value = station;
        to.value = station.value;
      }
    }

    if (newQuery.date) {
      try {
        // 将日期字符串解析为 YYYY-MM-DD 格式
        const parsedDate = new Date(newQuery.date);
        if (!isNaN(parsedDate.getTime())) {
          date.value = parsedDate.toISOString().split("T")[0];
        } else {
          date.value = new Date().toISOString().split("T")[0];
        }
      } catch {
        date.value = new Date().toISOString().split("T")[0];
      }
    }

    if (shouldSearch && fromStation.value && toStation.value && date.value) {
      searchTrains();
    }
  },
  { immediate: true }
);

// Mapping of seat types to image paths
const seatImageMap = {
  "Business Class": ["/src/assets/seats/CHR_business_01.png", "/src/assets/seats/CHR_business_02.png"],
  "First Class": ["/src/assets/seats/CHR-1st-01.png", "/src/assets/seats/CHR-1st-02.png"],
  "Second Class": ["/src/assets/seats/CHR-2st-01.png"],
};

// Computed property to get the current seat image
const selectedSeatImage = computed(() => {
  if (!selectedTrain.value || !selectedTrain.value.seats || selectedTrain.value.seats.length === 0) {
    return "/src/assets/seats/CHR_business_01.png"; // Default image
  }

  const seat = selectedTrain.value.seats[selectedSeatIndex.value];
  const images = seatImageMap[seat.type] || ["/src/assets/seats/CHR_business_01.png"];
  return images[currentImageIndex.value % images.length];
});

const initialize = async () => {
  loading.value = true;
  try {

    await Promise.all([currencyStore.initialize(), cityStore.initializeCityData()]);

    // 检查路由中是否有订单ID参数
    const orderId = route.params.orderId;

    if (orderId) {
      // 如果有订单ID，则通过订单ID获取时刻表信息
      const bookingStore = useBookingStore();
      bookingStore.setOrderId(orderId);

      try {
        const response = await getOrderTimetable(orderId);

        if (response.code === "0" && response.data) {
          const { fromStationCode, toStationCode, fromDate, trains } = response.data;

          // 设置搜索参数
          if (fromStationCode) {
            const station = allCities.value.find((c) => c.stationCode === fromStationCode);
            if (station) {
              fromStation.value = station;
              from.value = station.value;
            }
          }

          if (toStationCode) {
            const station = allCities.value.find((c) => c.stationCode === toStationCode);
            if (station) {
              toStation.value = station;
              to.value = station.value;
            }
          }

          if (fromDate) {
            date.value = fromDate;
          }

          // 处理列车数据
          processTrainData(trains);
          console.log("列车数据:", trains.value);
        } else {
          ElMessage.error("获取时刻表数据失败");
        }
      } catch (error) {
        console.error("获取时刻表数据失败:", error);
        ElMessage.error("获取时刻表数据失败，请稍后重试");
      }
    } else {
      // 如果没有订单ID，则使用查询参数
      const { from: fromCode, to: toCode, date: dateStr } = route.query;

      if (fromCode) {
        const station = allCities.value.find((c) => c.stationCode === fromCode);
        if (station) {
          fromStation.value = station;
          from.value = station.value;
        }
      }

      if (toCode) {
        const station = allCities.value.find((c) => c.stationCode === toCode);
        if (station) {
          toStation.value = station;
          to.value = station.value;
        }
      }

      if (dateStr) {
        try {
          // 将日期字符串解析为 YYYY-MM-DD 格式
          const parsedDate = new Date(dateStr);
          if (!isNaN(parsedDate.getTime())) {
            date.value = parsedDate.toISOString().split("T")[0];
          } else {
            date.value = new Date().toISOString().split("T")[0];
          }
        } catch {
          date.value = new Date().toISOString().split("T")[0];
        }
      } else {
        date.value = new Date().toISOString().split("T")[0];
      }

      // 如果有完整的查询参数，自动搜索
      if (fromStation.value && toStation.value && date.value) {
        searchTrains();
      }
    }
  } catch (error) {
    console.error("初始化失败:", error);
    ElMessage.error("加载数据失败");
  } finally {
    loading.value = false;
  }
};

// 计算服务费
const getSeatFee = (price) => {
  if (price < 60) return 60;
  if (price < 200) return 80;
  if (price < 500) return 120;
  if (price < 1000) return 150;
  if (price < 2000) return 250;
  if (price < 3000) return 300;
  return 500;
};

// 处理列车数据的函数
const processTrainData = (trainsData) => {
  if (!trainsData || !Array.isArray(trainsData) || trainsData.length === 0) {
    trains.value = [];
    return;
  }

  // 转换API响应以匹配UI格式
  trains.value = trainsData.map((train) => {
    // 处理座位信息
    const seats = [];
    if (train.swzPrice) {
      seats.push({
        type: "Business Class",
        seatPriceRaw: train.swzPrice,
        seatPrice: Math.round(train.swzPrice * 1.1),
        seatFee: getSeatFee(train.swzPrice),
        seatPriceTotal: Math.round(train.swzPrice * 1.1 + getSeatFee(train.swzPrice)),
        status: train.swzNum === "有" ? "Available" : train.swzNum === "0" ? "Sold out" : `${train.swzNum} left`,
        amenities: ["wifi", "power", "tv", "meal"],
      });
    }
    if (train.ydzPrice) {
      seats.push({
        type: "First Class",
        seatPriceRaw: train.ydzPrice,
        seatPrice: Math.round(train.ydzPrice * 1.1),
        seatFee: getSeatFee(train.ydzPrice),
        seatPriceTotal: Math.round(train.ydzPrice * 1.1 + getSeatFee(train.ydzPrice)),
        status: train.ydzNum === "有" ? "Available" : train.ydzNum === "0" ? "Sold out" : `${train.ydzNum} left`,
        amenities: ["wifi", "power"],
      });
    }
    if (train.edzPrice) {
      seats.push({
        type: "Second Class",
        seatPriceRaw: train.edzPrice,
        seatPrice: Math.round(train.edzPrice * 1.1),
        seatFee: getSeatFee(train.edzPrice),
        seatPriceTotal: Math.round(train.edzPrice * 1.1 + getSeatFee(train.edzPrice)),
        status: train.edzNum === "有" ? "Available" : train.edzNum === "0" ? "Sold out" : `${train.edzNum} left`,
        amenities: ["wifi", "power"],
      });
    }
    return {
      id: train.trainNo,
      number: train.trainCode,
      type: train.trainType === "G" ? "High-speed G" : train.trainType === "D" ? "High-speed D" : "Normal K",
      fromStation: train.fromStation,
      toStation: train.toStation,
      fromDate: train.fromDate,
      fromTime: train.fromTime,
      toTime: train.toTime,
      runTime: train.runTime,
      expanded: false,
      canBook: train.canBook,
      seats: seats,
      minPrice: seats.length > 0 ? Math.min(...seats.map((s) => s.seatPriceTotal)) : null,
    };
  });
};

// 搜索列车
const searchTrains = async () => {
  if (!fromStation.value || !toStation.value || !date.value) {
    ElMessage.warning("Please fill in all search fields");
    return;
  }

  loading.value = true;
  try {
    // 使用新的API接口
    const bookingStore = useBookingStore();
    const orderId = bookingStore.orderId;
    const response = await getOrderTimetable(orderId, {
      date: format(date.value, "yyyy-MM-dd"),
      from: fromStation.value.stationCode,
      to: toStation.value.stationCode,
      isStudent: false,
    });
    // 转换API响应以匹配UI格式
    trains.value = response.data.trains.map((train) => {
      // 处理座位信息
      const seats = [];
      if (train.swzPrice) {
        seats.push({
          type: "Business Class",
          price: train.swzPrice,
          status: train.swzNum === "有" ? "Available" : train.swzNum === "0" ? "Sold out" : `${train.swzNum} left`,
          amenities: ["wifi", "power", "tv", "meal"],
        });
      }
      if (train.ydzPrice) {
        seats.push({
          type: "First Class",
          price: train.ydzPrice,
          status: train.ydzNum === "有" ? "Available" : train.ydzNum === "0" ? "Sold out" : `${train.ydzNum} left`,
          amenities: ["wifi", "power"],
        });
      }
      if (train.edzPrice) {
        seats.push({
          type: "Second Class",
          price: train.edzPrice,
          status: train.edzNum === "有" ? "Available" : train.edzNum === "0" ? "Sold out" : `${train.edzNum} left`,
          amenities: ["wifi", "power"],
        });
      }

      return {
        id: train.trainNo,
        number: train.trainCode,
        type: train.trainType === "G" ? "High-speed G" : train.trainType === "D" ? "High-speed D" : "Normal K",
        fromStation: train.fromStation,
        toStation: train.toStation,
        fromDate: train.fromDate,
        fromTime: train.fromTime,
        toTime: train.toTime,
        runTime: train.runTime,
        expanded: false,
        canBook: train.canBook,
        seats: seats,
        minPrice: seats.length > 0 ? Math.min(...seats.map((s) => s.price)) : null,
      };
    });
  } catch (error) {
    console.error("Error fetching trains:", error);
    ElMessage.error("Failed to fetch train schedules. Please try again.");
  } finally {
    loading.value = false;
  }
};

// 展开列车详情
const expandDetails = (train, event) => {
  // If the event is from a click on the close button, don't toggle
  if (event && event.target.closest(".custom-close-button")) {
    return;
  }

  // Close any other expanded trains first
  trains.value.forEach((t) => {
    if (t.id !== train.id) {
      t.expanded = false;
    }
  });

  // Toggle the selected train
  train.expanded = !train.expanded;

  // Set the selected train for seat selection
  if (train.expanded) {
    selectedTrain.value = train;
    selectedSeatIndex.value = 1; // Default to First Class if available
    currentImageIndex.value = 0; // Reset image index
  }
};

// 选择座位
const selectSeat = (index) => {
  selectedSeatIndex.value = index;
  currentImageIndex.value = 0; // Reset image index when changing seat type
};

// 下一张座位图片
const nextSeatImage = () => {
  if (!selectedTrain.value || !selectedTrain.value.seats) return;

  const seat = selectedTrain.value.seats[selectedSeatIndex.value];
  const images = seatImageMap[seat.type] || [];
  if (images.length > 1) {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
  }
};

// 上一张座位图片
const prevSeatImage = () => {
  if (!selectedTrain.value || !selectedTrain.value.seats) return;

  const seat = selectedTrain.value.seats[selectedSeatIndex.value];
  const images = seatImageMap[seat.type] || [];
  if (images.length > 1) {
    currentImageIndex.value = (currentImageIndex.value - 1 + images.length) % images.length;
  }
};

// 格式化日期，例如 '20 March'
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

// 提交车次和座位客信息，跳转到乘客信息页面
const submitTrainSeat = async (train, seat) => {
  // 显示加载中
  const loading = ElLoading.service({
    lock: true,
    text: "正在创建订单...",
    background: "rgba(0, 0, 0, 0.7)",
  });

  try {
    const trainSeatData = {
      orderId: bookingStore.orderId,
      step: 2,
      trainNo: train.number,
      fromStation: train.fromStation,
      toStation: train.toStation,
      fromDate: date.value,
      fromTime: train.fromTime,
      toTime: train.toTime,
      runTime: train.runTime,
      seatType: seat.type,
      seatPriceRaw: seat.seatPriceRaw,
      seatPrice: seat.seatPrice,
      seatFee: seat.seatFee,
      seatPriceTotal: seat.seatPriceTotal
    };
    console.log("trainSeatData", trainSeatData);
    // 更新订单的车次和座位选择
    await updateOrderTrainSeat(bookingStore.orderId, trainSeatData);

    // 更新激活步骤为"乘客信息"
    bookingStore.setActiveStep(2);

    // 关闭加载中
    loading.close();

    // 跳转到新的乘客信息页面，只传递orderId
    router.push({
      path: `/trains/order/${bookingStore.orderId}/passengers`,
    });
  } catch (error) {
    console.error("创建订单失败:", error);
    ElMessage.error("创建订单失败，请重试");
    loading.close();
  }
};

const handleSearchCardSubmit = (searchParams) => {
  fromStation.value = searchParams.from;
  toStation.value = searchParams.to;
  date.value = searchParams.date;
  showSearchCard.value = false;
  searchTrains();
};
</script>

<style scoped>
.container {
  width: 70%;
  margin: 0 auto;
}
.horizontal-separator {
  height: 10px;
  background-color: #e2e2e2;
}

.search-results {
  padding: 24px;
  min-height: 100vh;
  min-width: 800px;
  position: relative;
}

.search-params-display {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-weight: 700;
  padding: 12px 20px;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.search-params-display:hover {
  background-color: var(--el-color-primary-light-8, #e6f1fc);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.route-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

.city {
  font-size: 16px;
  font-weight: 700;
  color: var(--el-text-color-primary, #303133);
}

.direction-icon {
  font-size: 20px;
  color: var(--el-text-color-secondary, #909399);
}

.date-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--el-text-color-primary, #303133);
}

.edit-icon {
  font-size: 16px;
  color: var(--el-text-color-secondary, #909399);
  cursor: pointer;
}

.search-card-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.search-card-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 800px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.filters {
  display: flex;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  gap: 12px;
  max-width: 1200px;
  width: 100%;
  margin-left: 0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: calc(33.33% - 8px);
  width: calc(33.33% - 8px);
}

.filter-group label {
  white-space: nowrap;
  font-size: 14px;
  color: #606266;
}

.filter-select {
  flex: 1;
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  width: 100%;
  box-sizing: border-box;
}

:deep(.el-select .el-input__inner) {
  height: 30px;
  line-height: 30px;
  font-size: 13px;
}

:deep(.el-select__popper) {
  border-radius: 4px;
}

:deep(.el-select-dropdown__item) {
  font-size: 13px;
  padding: 0 12px;
  height: 32px;
  line-height: 32px;
}

.results-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: visible;
}

.list-header {
  display: flex;
  padding: 12px 24px;
  border-bottom: 1px solid #ebeef5;
  color: #909399;
  font-size: 14px;
}

/* Train card styles to match the UI in the image */
.train-card {
  background: white;
  border-radius: 0;
  margin-bottom: 0;
  overflow: hidden;
  box-shadow: none;
  border: 1px solid #e4e7ed;
  border-bottom: 3px solid #e4e7ed;
  transition: all 0.3s ease;
  position: relative;
}

.train-card.expanded {
  width: 112%;
  margin-left: -6%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 5;
  border-color: #409eff;
  border-width: 1px;
  border-bottom-width: 3px;
  border-radius: 8px 8px 0 0;
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
}

.train-card:first-child {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.train-card:last-child {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom: none;
}

.train-date {
  padding: 6px 0;
  font-size: 13px;
  color: #909399;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-top: 4px;
  font-style: italic;
}

.train-item {
  display: flex;
  padding: 20px;
  position: relative;
}

.col {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.departure-section,
.arrival-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.connection-section {
  flex: 0.8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 10px;
}

.time-large {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.station {
  font-size: 14px;
  color: #606266;
  margin-top: 6px;
}

.connection-line {
  height: 2px;
  background: #dcdfe6;
  position: relative;
  width: 100%;
  margin: 10px 0;
}

.distance {
  font-size: 13px;
  color: #909399;
  margin-bottom: 6px;
  text-align: center;
}

.connection-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dcdfe6;
  top: -3px;
}

.connection-dot.start {
  left: 0;
}

.connection-dot.end {
  right: 0;
}

.train-info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px;
  border-left: 2px solid #e4e7ed;
}

.train-type-tag {
  display: inline-block;
  background-color: #ffc107;
  color: #212121;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 6px;
  width: fit-content;
}

.train-number {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.price-section-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px;
  border-left: 2px solid #e4e7ed;
}

.action-column {
  flex: 0.8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
  border-left: 2px solid #e4e7ed;
}

.from-price {
  font-size: 14px;
  color: #606266;
}

.price-value {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
}

.passenger-price {
  font-size: 12px;
  color: #909399;
  margin: 4px 0 10px;
}

.action-btn {
  min-width: 120px;
  transition: all 0.3s ease;
}

.select-seats-btn {
  background-color: #409eff;
  border-color: #409eff;
}

.cancel-btn {
  background-color: #f56c6c;
  border-color: #f56c6c;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
  transform: translateY(-2px);
}

.cancel-btn:hover {
  background-color: #e64242 !important;
  border-color: #e64242 !important;
  box-shadow: 0 6px 16px rgba(245, 108, 108, 0.4);
  transform: translateY(-2px);
}

.train-details {
  margin: 0;
  padding: 16px 24px;
  background: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
}

.seat-detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.seat-detail:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.seat-info {
  flex: 1;
}

.seat-type {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.amenities {
  display: flex;
  gap: 8px;
}

.amenity-icon {
  width: 20px;
  height: 20px;
  opacity: 0.7;
}

.seat-status {
  flex: 1;
  text-align: center;
  color: #909399;
  font-size: 14px;
  text-transform: uppercase;
}

.seat-price {
  flex: 0.5;
  text-align: right;
  background: #ff4081;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
}

.currency {
  font-size: 12px;
  margin-right: 2px;
}

.amount {
  font-size: 16px;
}

/* Train Detail Dialog Styles */
:deep(.train-detail-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.train-detail-dialog .el-dialog__header) {
  padding: 12px 20px;
  background-color: #f5f5f5;
  margin-right: 0;
  text-align: center;
  font-weight: 500;
  color: #606266;
  border-bottom: 1px solid #e4e7ed;
}

:deep(.train-detail-dialog .el-dialog__body) {
  padding: 0;
}

:deep(.train-detail-dialog .el-dialog__headerbtn) {
  top: 12px;
}

.dialog-train-header {
  display: flex;
  padding: 20px;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
}

.dialog-time-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.dialog-time-section:last-child {
  align-items: flex-end;
}

.dialog-time {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
}

.dialog-station {
  font-size: 14px;
  color: #606266;
  margin-top: 4px;
}

.dialog-journey-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dialog-distance {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.dialog-arrow {
  font-size: 20px;
  color: #909399;
}

.dialog-train-info {
  padding: 15px 20px;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-train-tag {
  display: inline-block;
  background-color: #ffc107;
  color: #212121;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  width: fit-content;
}

.dialog-train-number {
  font-size: 14px;
  color: #606266;
  margin-left: 10px;
}

.dialog-passenger-info {
  font-size: 14px;
  color: #606266;
  text-align: right;
}

.dialog-important-note {
  padding: 15px 20px;
  background-color: #fef0f0;
  border-radius: 4px;
  margin: 0 20px 20px;
  font-size: 14px;
  color: #f56c6c;
  line-height: 1.5;
  box-shadow: 0 2px 6px rgba(245, 108, 108, 0.1);
  border-left: 4px solid #f56c6c;
}

.dialog-tabs {
  display: flex;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
  position: relative;
}

.dialog-tab {
  padding: 12px 20px;
  font-size: 14px;
  color: #909399;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.dialog-tab.active {
  color: #409eff;
  border-bottom-color: #409eff;
  font-weight: 500;
}

.dialog-info-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #f4f4f5;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-style: italic;
  font-weight: bold;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  padding: 0 20px;
  width: 100%;
}

.dialog-seat-selection-layout {
  display: flex;
  flex-direction: row;
  background-color: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  margin: 20px 0;
  border: 1px solid #e4e7ed;
  max-width: 100%;
  width: 100%;
}

.dialog-seat-image-container {
  flex: 3;
  position: relative;
  background-color: #000;
  overflow: hidden;
  min-height: 400px;
  max-height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-seat-selection-panel {
  flex: 2;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 0;
  overflow-y: auto;
  max-width: 40%;
}

.dialog-tabs {
  display: flex;
  border-bottom: 1px solid #e4e7ed;
  padding: 0;
  background-color: #f5f7fa;
  justify-content: space-between;
}

.dialog-tab {
  padding: 15px 20px;
  font-size: 16px;
  font-weight: 500;
  color: #606266;
  cursor: pointer;
  position: relative;
  text-align: center;
}

.dialog-tab:first-child {
  margin-left: 20px;
}

.dialog-tab:last-child {
  margin-right: 20px;
}

.dialog-tab.active {
  color: #303133;
  font-weight: 600;
}

.dialog-tab.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 90%;
  height: 2px;
  background-color: #002855;
}

.dialog-info-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f0f2f5;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-top: 15px;
  font-style: italic;
  font-weight: 600;
  cursor: pointer;
}

.dialog-seat-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  max-height: 400px;
}

.dialog-seat-description {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 14px;
  line-height: 1.5;
  backdrop-filter: blur(3px);
}

.show-more-link {
  color: #ffc107;
  text-decoration: none;
  margin-left: 5px;
}

.dialog-image-navigation {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  transform: translateY(-50%);
  z-index: 10;
}

.nav-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.dialog-seat-options {
  padding: 15px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 400px;
  overflow-y: auto;
}

.dialog-seat-option {
  display: flex;
  background-color: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
  cursor: pointer;
  height: 120px;
  overflow: hidden;
}

.dialog-seat-option:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dialog-seat-option.selected {
  border-color: #002855;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.dialog-seat-info {
  flex: 1;
  padding: 12px 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.dialog-seat-type {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.dialog-seat-amenities {
  display: flex;
  gap: 12px;
}

.dialog-amenity-icon {
  width: 24px;
  height: 24px;
  opacity: 0.8;
}

.dialog-seat-price-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  padding: 5px 15px;
  transition: all 0.3s ease;
}

.selected-price-section {
  background-color: #002855;
  color: white;
}

.dialog-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 0;
}

.dialog-price-currency {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  margin-right: 2px;
}

.selected .dialog-price-currency {
  color: white;
}

.dialog-price-amount {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
}

.selected .dialog-price-amount {
  color: white;
}

.dialog-per-seat {
  font-size: 14px;
  color: #909399;
  margin-top: 0;
  margin-bottom: 6px;
}

.selected .dialog-per-seat {
  color: white;
}

.dialog-book-btn {
  width: 100%;
  margin-top: 4px;
  background-color: white;
  color: #002855;
  border-color: white;
  font-weight: 600;
  border-radius: 4px;
  padding: 8px 15px;
  height: auto;
}

.dialog-footer {
  padding: 20px;
  background-color: white;
  border-top: 1px solid #e4e7ed;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.dialog-total {
  font-size: 14px;
  color: #606266;
}

.dialog-total-price {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
}

.dialog-continue-btn {
  min-width: 120px;
}

@media (max-width: 768px) {
  .search-results {
    width: 95%;
    padding: 16px;
  }

  .search-params,
  .filters {
    flex-direction: column;
  }

  .swap-icon {
    right: 8px;
    bottom: 12px;
  }

  .train-item {
    flex-wrap: wrap;
  }

  .col {
    flex: 50% !important;
    margin-bottom: 16px;
  }

  .col.action {
    flex: 100% !important;
    align-items: stretch;
  }

  .dialog-train-header {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  .dialog-time-section:last-child {
    align-items: flex-start;
  }

  .dialog-seat-option {
    flex-direction: column;
    gap: 15px;
  }

  .dialog-seat-price-section {
    align-items: flex-start;
  }

  .dialog-footer {
    flex-direction: column;
    gap: 15px;
  }

  .dialog-continue-btn {
    width: 100%;
  }
}

/* Inline train details styles */
.inline-train-details {
  border-top: 0;
  position: relative;
  overflow: visible;
  transition: all 0.3s ease;
  margin-bottom: 0;
  width: 94%;
  margin-left: auto;
  margin-right: auto;
  z-index: 4;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Close button styles removed */
</style>
