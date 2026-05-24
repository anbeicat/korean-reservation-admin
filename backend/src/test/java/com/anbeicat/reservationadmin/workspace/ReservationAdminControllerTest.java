package com.anbeicat.reservationadmin.workspace;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ReservationAdminControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void getWorkspaceReturnsInitialData() throws Exception {
    mockMvc.perform(get("/api/workspace"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.data.reservations", hasSize(5)))
      .andExpect(jsonPath("$.data.services", hasSize(4)))
      .andExpect(jsonPath("$.data.customers", hasSize(5)));
  }

  @Test
  void updateReservationStatusReturnsUpdatedReservation() throws Exception {
    mockMvc.perform(patch("/api/reservations/2/status")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"status\":\"CONFIRMED\"}"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.data.id").value(2))
      .andExpect(jsonPath("$.data.status").value("CONFIRMED"));
  }

  @Test
  void createReservationRejectsDuplicatedSlot() throws Exception {
    mockMvc.perform(post("/api/reservations")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
          {
            "customer": "한소라",
            "phone": "010-6677-8899",
            "serviceId": "hair-cut",
            "reservationDate": "2026-05-23",
            "time": "10:00",
            "memo": "중복 테스트"
          }
          """))
      .andExpect(status().isConflict())
      .andExpect(jsonPath("$.code").value("RESERVATION_SLOT_CONFLICT"));
  }
}
